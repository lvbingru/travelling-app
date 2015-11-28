//
//  RCTBaiduMapView.m
//  map
//
//  Created by LvBingru on 11/24/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "RCTBaiduMapView.h"
#import <BaiduMapAPI_Map/BMKMapComponent.h>

@interface RCTBaiduMapView()

/** 记录上一次的位置 */
@property (nonatomic, strong) CLLocation *preLocation;

/** 位置数组 */
//@property (nonatomic, strong) NSMutableArray *locationArrayM;

/** 轨迹线 */
@property (nonatomic, strong) BMKPolyline *polyLine;

@end

@implementation RCTBaiduMapView

/**
 *  绘制轨迹路线
 */
- (void)drawWalkPolyline:(NSArray *)locationArray
{
  // 轨迹点数组个数
  NSUInteger count = locationArray.count;
  
  if (count < 2) {
    return;
  }
  
  // 动态分配存储空间
  // BMKMapPoint是个结构体：地理坐标点，用直角地理坐标表示 X：横坐标 Y：纵坐标
  CLLocationCoordinate2D *tempPoints = new CLLocationCoordinate2D[count];
  
  __block CLLocationCoordinate2D northEastPoint;
  __block CLLocationCoordinate2D southWestPoint;
  
//  // 遍历数组
  [locationArray enumerateObjectsUsingBlock:^(NSDictionary *loc, NSUInteger idx, BOOL *stop) {
    double latitude = ((NSNumber *)(loc[@"latitude"])).doubleValue;
    double longitude = ((NSNumber *)(loc[@"longitude"])).doubleValue;
    
    CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(latitude, longitude);
      tempPoints[idx] = coordinate;
    
    if (idx == 0) {
      northEastPoint = coordinate;
      southWestPoint = coordinate;
    }
    else
    {
      if (coordinate.longitude > northEastPoint.longitude)
        northEastPoint.longitude = coordinate.longitude;
      if(coordinate.latitude > northEastPoint.latitude)
        northEastPoint.latitude = coordinate.latitude;
      if (coordinate.longitude < southWestPoint.longitude)
        southWestPoint.longitude = coordinate.longitude;
      if (coordinate.latitude < southWestPoint.latitude)
        southWestPoint.latitude = coordinate.latitude;
    }
  }];
  
  //移除原有的绘图，避免在原来轨迹上重画
  if (self.polyLine) {
    [self removeOverlay:self.polyLine];
  }
  
  // 通过points构建BMKPolyline
  self.polyLine = [BMKPolyline polylineWithCoordinates:tempPoints count:count];
  
  //添加路线,绘图
  if (self.polyLine) {
    [self addOverlay:self.polyLine];
  }
  
  // 清空 tempPoints 临时数组
  delete []tempPoints;
  
  // 根据polyline设置地图范围
  
  CLLocationCoordinate2D centerCoordinate = CLLocationCoordinate2DMake((northEastPoint.latitude + southWestPoint.latitude)/2, (northEastPoint.longitude + southWestPoint.longitude)/2);
  
  BMKCoordinateSpan span = {
    (northEastPoint.latitude - southWestPoint.latitude) *2,
     (northEastPoint.longitude - southWestPoint.longitude) *2
  };
  
  BMKCoordinateRegion region = {
    centerCoordinate,
    span
  };
  
  [self setRegion:region animated:NO];

}

- (void)dealloc
{
    self.delegate = nil;
}

@end
