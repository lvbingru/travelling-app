//
//  RCTBaiduLocationObserver.m
//  RCTBaiduMap
//
//  Created by LvBingru on 11/25/15.
//  Copyright © 2015 erica. All rights reserved.
//

#import "RCTBaiduLocationObserver.h"
#import <BaiduMapAPI_Location/BMKLocationComponent.h>
#import "RCTBaiduMap.h"

@interface RCTBaiduLocationObserver()<BMKLocationServiceDelegate> {
//    BMKLocationService *_locService;
}

@end

@implementation RCTBaiduLocationObserver

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (instancetype)init
{
    self = [super init];
    if (self) {
//        _locService = [BMKLocationService new];
//        _locService.delegate = self;
//        _locService.allowsBackgroundLocationUpdates = YES;
//        _locService.pausesLocationUpdatesAutomatically = NO;
        
    }
    return self;
}

- (void)dealloc
{
//    _locService.delegate = nil;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(loadRecordLocation:(RCTResponseSenderBlock)resolve)
{
    [[RCTBaiduMap sharedManager] loadRecordLocation:resolve];
}

RCT_EXPORT_METHOD(startRecordLocation:(NSDictionary *)options)
{
    [[RCTBaiduMap sharedManager] startRecordLocation:options];
}

RCT_EXPORT_METHOD(stopRecordLocation:(RCTResponseSenderBlock)resolve)
{
    [[RCTBaiduMap sharedManager] stopRecordLocation:resolve];
}

RCT_EXPORT_METHOD(pauseRecordLocation)
{
    [[RCTBaiduMap sharedManager] pauseRecordLocation];
}

RCT_EXPORT_METHOD(continueRecordLocation)
{
    [[RCTBaiduMap sharedManager] continueRecordLocation];
}

//#pragma mark - delegate
//
////实现相关delegate 处理位置信息更新
////处理方向变更信息
//- (void)didUpdateUserHeading:(BMKUserLocation *)userLocation
//{
//    //NSLog(@"heading is %@",userLocation.heading);
//}
//
////处理位置坐标更新
//- (void)didUpdateBMKUserLocation:(BMKUserLocation *)userLocation
//{
////    NSLog(@"didUpdateUserLocation lat %f,long %f",userLocation.location.coordinate.latitude,userLocation.location.coordinate.longitude);
//}

@end
