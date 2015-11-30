//
//  RCTBaiduMapView.h
//  map
//
//  Created by LvBingru on 11/24/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import <BaiduMapAPI_Map/BMKMapView.h>

@interface RCTBaiduMapView : BMKMapView

- (void)drawWalkPolyline:(NSArray *)locationArray;

@end
