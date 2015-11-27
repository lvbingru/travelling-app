//
//  RCTBaiduMapManager.m
//  map
//
//  Created by LvBingru on 11/23/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "RCTBaiduMapManager.h"
#import "RCTBaiduMapView.h"
#import <BaiduMapAPI_Map/BMKMapComponent.h>

@interface RCTBaiduMapManager()<BMKMapViewDelegate> {

}

@end

@implementation RCTBaiduMapManager

RCT_EXPORT_MODULE()

- (instancetype)init
{
    self = [super init];
    if (self) {
        
    }
    return self;
}

RCT_CUSTOM_VIEW_PROPERTY(locationArray, NSArray, RCTBaiduMapView)
{
  [view drawWalkPolyline:json];
}

- (UIView *)viewWithProps:(__unused NSDictionary *)props
{
    RCTBaiduMapView *map = [RCTBaiduMapView new];
    map.delegate = self;
    return map;
}

#pragma mark - delegate

- (BMKOverlayView *)mapView:(BMKMapView *)mapView viewForOverlay:(id <BMKOverlay>)overlay{
  
  NSLog(@"viewForOverlay");

  if ([overlay isKindOfClass:[BMKPolyline class]]){
    BMKPolylineView* polylineView = [[BMKPolylineView alloc] initWithOverlay:overlay];
    polylineView.strokeColor = [[UIColor purpleColor] colorWithAlphaComponent:1];
    polylineView.lineWidth = 5.0;
    
    return polylineView;
  }
  return nil;
}

@end
