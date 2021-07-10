//
//  InitialVC.h
//  ArascaMedical
//
//  Created by CHITRESH GOYAL on 07/04/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

NS_ASSUME_NONNULL_BEGIN

@interface InitialVC : UIViewController<RCTBridgeDelegate> {
  
  RCTRootView *rootView;
}
@property (weak, nonatomic) IBOutlet UIView *videovw;
@property (strong, nonatomic) IBOutlet UIView *vwInitial;

@end

NS_ASSUME_NONNULL_END
