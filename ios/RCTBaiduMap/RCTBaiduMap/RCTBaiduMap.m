//
//  RCTBaiduMap.m
//  RCTBaiduMap
//
//  Created by LvBingru on 11/25/15.
//  Copyright © 2015 erica. All rights reserved.
//

#import "RCTBaiduMap.h"
#import <BaiduMapAPI_Location/BMKLocationComponent.h>

enum {
    RECORD_STATE_CLOSE = 0,
    RECORD_STATE_RECORDING = 1,
    RECORD_STATE_PAUSE = 2,
};

@interface RCTBaiduMap()<BMKGeneralDelegate, BMKLocationServiceDelegate>
{
    BMKMapManager *_mapManager;
    BMKLocationService *_locService;
    CLLocationManager *_locationManager;
    
    NSString *_recordKey;
    NSMutableArray *_locations;
    int _state; // 0,未记录，1，记录中 2，暂停中
    
    dispatch_queue_t _recordQueue;
}

@end


@implementation RCTBaiduMap {
}

+ (instancetype)sharedManager
{
    static RCTBaiduMap *sharedManager = nil;
    
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedManager = [self new];
    });
    
    return sharedManager;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        _mapManager = [BMKMapManager new];
        
        _locService = [BMKLocationService new];
        _locService.delegate = self;
        _locService.pausesLocationUpdatesAutomatically = NO;
        _locService.allowsBackgroundLocationUpdates = YES;

        _locationManager = [CLLocationManager new];
        _locationManager.pausesLocationUpdatesAutomatically = NO;
        if ([_locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) {
            [_locationManager requestAlwaysAuthorization];
        }
        if ([_locationManager respondsToSelector:@selector(allowsBackgroundLocationUpdates)]) {
            [_locationManager allowsBackgroundLocationUpdates];
        }
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onApplicationWillTerminate) name:UIApplicationWillTerminateNotification object:nil];
        
        _locations = [NSMutableArray new];
        _recordKey = @"0";
        _state = 0;
        
        _recordQueue = dispatch_queue_create("com.tdzl.recordQueue", DISPATCH_QUEUE_SERIAL);
        
        [self loadRecord];
    }
    return self;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    _locService.delegate = nil;
    _locationManager.delegate = nil;
    
    [self saveRecord];
}

- (void)onApplicationWillTerminate
{
    [self saveRecord];
}

const NSString *gSaveKey = @"BMPStepRecord";

- (NSString *)getRecordFilePath
{
    static NSString *path = nil;
    static dispatch_once_t token;
    
    dispatch_once(&token, ^{
        
        NSArray * paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        path = [paths lastObject];
        
        NSString *fileName = [gSaveKey copy];
        path = [path stringByAppendingPathComponent:fileName];
    });
    
    return path;
}

- (void)loadRecord
{
    dispatch_sync(_recordQueue, ^{
        NSData *jsonData = [NSData dataWithContentsOfFile:[self getRecordFilePath]];
        if (jsonData) {
            NSDictionary *dic = (NSDictionary *)[NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:nil];
            if (dic != nil) {
                
                _recordKey = dic[@"key"];
                if (_recordKey.length <= 0) {
                    _recordKey = @"0";
                }
                _state = [dic[@"state"] intValue];
                _locations = [dic[@"locations"] mutableCopy];
                if (_locations == nil) {
                    _locations = [NSMutableArray new];
                }
            }
        }
    });
    
    if (_state == 1) {
        [self continueRecordLocation];
    }
}

- (void)saveRecord
{
    dispatch_async(_recordQueue, ^{
        NSString *path = [self getRecordFilePath];
        
        BOOL isDirectory;
        if ([[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:&isDirectory]==NO || isDirectory == YES) {
            BOOL success = [[NSFileManager defaultManager] createFileAtPath:path contents:nil attributes:nil];
            if (success == NO) {
                NSLog(@"BMPStepRecord file create error");
            }
        }
        
        NSDictionary *result = [self genResult];
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:result options:NSJSONWritingPrettyPrinted error:nil] ;
        
        BOOL success = [jsonData writeToFile:path atomically:YES];
        if (success == NO) {
            NSLog(@"BMPStepRecord file write error");
        }
    });
}

+ (void)registerAppId:(NSString *)aString launchOptions:(NSDictionary *)launchOptions
{
    RCTBaiduMap *map = [RCTBaiduMap sharedManager];
    [map->_mapManager start:aString generalDelegate:map];
    [map handleLaunchOptions:launchOptions];
}

- (void)handleLaunchOptions:(NSDictionary *)launchOptions
{
    if ([launchOptions objectForKey:UIApplicationLaunchOptionsLocationKey]) {
        if (_state == RECORD_STATE_RECORDING) {
            [self continueRecordLocation];
        }
    }
}

- (void)startRecordLocation:(NSDictionary *)options
{
    _recordKey = options[@"key"];
    if (_recordKey.length <= 0) {
        _recordKey = @"0";
    }
    _state = RECORD_STATE_RECORDING;
    _locations = [NSMutableArray new];
    [_locService startUserLocationService];
}

- (void)stopRecordLocation:(RCTResponseSenderBlock)resolve
{
    _state = RECORD_STATE_CLOSE;
    [_locService stopUserLocationService];

    [self saveRecord];

    resolve(@[[self genResult]]);
}

- (void)pauseRecordLocation
{
    _state = RECORD_STATE_PAUSE;
    [_locService stopUserLocationService];

    [self saveRecord];
}

- (void)continueRecordLocation
{
    _state = RECORD_STATE_RECORDING;
    [_locService startUserLocationService];
}

- (void)loadRecordLocation:(RCTResponseSenderBlock)resolve
{
    resolve(@[[self genResult]]);
}

- (NSDictionary *)genResult
{
    NSDictionary *result =  @{@"key":_recordKey, @"locations":_locations, @"state":@(_state)};
    return result;
}


#pragma mark - BMKGeneralDelegate

- (void)onGetNetworkState:(int)iError
{
    if (0 == iError) {
        NSLog(@"联网成功");
    }
    else{
        NSLog(@"onGetNetworkState %d",iError);
    }
    
}

- (void)onGetPermissionState:(int)iError
{
    if (0 == iError) {
        NSLog(@"授权成功");
    }
    else {
        NSLog(@"onGetPermissionState %d",iError);
    }
}


#pragma mark - delegate

//实现相关delegate 处理位置信息更新
//处理方向变更信息
- (void)didUpdateUserHeading:(BMKUserLocation *)userLocation
{
    //NSLog(@"heading is %@",userLocation.heading);
}

//处理位置坐标更新
- (void)didUpdateBMKUserLocation:(BMKUserLocation *)userLocation
{
    CLLocation *location = userLocation.location;
    
#ifdef DEBUG
    NSLog(@"didUpdateUserLocation lat %f,long %f",location.coordinate.latitude,location.coordinate.longitude);
#endif
    
    NSDictionary *locationDic = @{
                                  @"latitude": @(location.coordinate.latitude),
                                  @"longitude": @(location.coordinate.longitude),
                                  @"altitude": @(location.altitude),
                                  @"accuracy": @(location.horizontalAccuracy),
                                  @"altitudeAccuracy": @(location.verticalAccuracy),
                                  @"heading": @(location.course),
                                  @"speed": @(location.speed),
                           @"timestamp": @(CFAbsoluteTimeGetCurrent() * 1000.0) // in ms
                           };
    
    [_locations addObject:locationDic];
    
    if (_locations.count % 10 == 0) {
        [self saveRecord];
    }
}


@end
