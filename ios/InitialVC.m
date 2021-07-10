//
//  InitialVC.m
//  ArascaMedical
//
//  Created by CHITRESH GOYAL on 07/04/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "InitialVC.h"
#import "AppDelegate.h"
#import <React/RCTBridgeDelegate.h>

@interface InitialVC ()

@end

@implementation InitialVC

- (void)viewDidLoad {
  [super viewDidLoad];
  
  AppDelegate *delegate = (AppDelegate*)[[UIApplication sharedApplication] delegate];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:[delegate launchOptions]];
    
  rootView = [[RCTRootView alloc] initWithBridge:bridge
                                      moduleName:@"ArascaMedical"
                               initialProperties:nil];
  
  UIImage *img;// = [UIImage imageNamed:@"2"];

  if([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
    switch ((int)[[UIScreen mainScreen] nativeBounds].size.height) {
      case 1136:
        img = [UIImage imageNamed:@"1"];
       break;

      case 1334:
        img = [UIImage imageNamed:@"iPhone8.png"];
        break;

      case 2208:
        img = [UIImage imageNamed:@"iPhone8Plus.png"];
        break;

      case 2436:
        img = [UIImage imageNamed:@"Pro.png"];
        break;

      case 2688:
        img = [UIImage imageNamed:@"ProMax.png"];
        break;

      case 1792:
        img = [UIImage imageNamed:@"iPhone11.png"];
        break;

      default:
        img = [UIImage imageNamed:@"1"];
        break;
    }
  }

  rootView.contentView.backgroundColor = [UIColor colorWithPatternImage:img];
  self.view = rootView;
  
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  #if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
  
}

@end
