//
//  MasterCardPayment.m
//  ArascaMedical
//
//  Created by admin on 18/03/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(MasterCardPayment, NSObject)

//RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location date:(nonnull NSNumber *)date callback: (RCTResponseSenderBlock)callback);

RCT_EXTERN_METHOD(findEvents:(NSDictionary *)paymentMethodDetail callback:(RCTResponseSenderBlock)callback);



@end
  
