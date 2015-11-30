//
//  RCTBaiduMap.h
//  RCTBaiduMap
//
//  Created by LvBingru on 11/25/15.
//  Copyright © 2015 erica. All rights reserved.
//

#import "RCTBridgeModule.h"

@interface RCTBaiduMap : NSObject

+ (instancetype)sharedManager;
+ (void)registerAppId:(NSString *)aString launchOptions:(NSDictionary *)launchOptions;

- (void)startRecordLocation:(NSDictionary *)options;
- (void)stopRecordLocation:(RCTResponseSenderBlock)resolve;
- (void)pauseRecordLocation;
- (void)continueRecordLocation;
- (void)loadRecordLocation:(RCTResponseSenderBlock)resolve;

@end
