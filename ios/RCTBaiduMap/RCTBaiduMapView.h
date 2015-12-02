//
//  RCTBaiduMapView.h
//  map
//
//  Created by LvBingru on 11/24/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import <BaiduMapAPI_Map/BMKMapView.h>
#import "RCTComponent.h"

@interface RCTBaiduMapView : BMKMapView

@property (nonatomic, copy) RCTBubblingEventBlock onFinishLoad;
- (void)drawWalkPolyline:(NSArray *)locationArray;

@end
