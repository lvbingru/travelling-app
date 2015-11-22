//
//  TextMeasurer.m
//  AwesomeProject
//
//  Created by 杨辰 on 11/17/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

//  TextMeasurer.m
#import "TextMeasurer.h"

@implementation TextMeasurer

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(get:(NSString *)text font:(NSString*) font size:(float)size cb:(RCTResponseSenderBlock)callback)
{
  UILabel *label = [[UILabel alloc]init];
  label.font = [UIFont fontWithName:font size:size];
  label.text = text;
  
  callback(@[[NSNumber numberWithDouble: label.intrinsicContentSize.width]]);
}

@end