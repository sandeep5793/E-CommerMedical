/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase.h>
#import "LandingVC.h"
#import "InitialVC.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
//  [UIApplication sharedApplication].setApplicationIconBadgeNumber = 0;
  
  
  [FIRApp configure];
  for (NSString* family in [UIFont familyNames])
  {
    NSLog(@"%@", family);
    for (NSString* name in [UIFont fontNamesForFamilyName: family])
    {
      NSLog(@" %@", name);
    }
  }
  launchOptions = [[NSDictionary alloc] init];
  launchOptions = launchOptions;
//  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
//  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
//  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
//                                                   moduleName:@"ArascaMedical"
//                                            initialProperties:nil];
//
//  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
//
//  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//  UIViewController *rootViewController = [UIViewController new];
//  rootViewController.view = rootView;
//  self.window.rootViewController = rootViewController;
//  [self.window makeKeyAndVisible];
  
  [self createLandingAsRoot];
  
  return YES;
}

-(void) createReactAsRoot{
//  
//  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:self.launchOptions];
//  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
//                                                   moduleName:@"ArascaMedical"
//                                            initialProperties:nil];
//  //  rootView.loadingViewFadeDelay = 0.0;
//  //  rootView.loadingViewFadeDuration = 0.15;
//  
//  rootView.backgroundColor = [[UIColor alloc] initWithRed:1 green:1 blue:1 alpha:1];
//  
//  
//  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//  UIViewController *rootViewController = [UIViewController new];
//  rootViewController.view = rootView;
//  
//  UIImageView *dot = [[UIImageView alloc] initWithFrame:rootView.frame];
//  dot.image = [UIImage imageNamed:@"SplashIcon"];
//  dot.contentMode = UIViewContentModeScaleAspectFit;
//  
//  [rootViewController.view addSubview:dot];
//    
//  self.window.rootViewController = rootViewController;
//  [self.window makeKeyAndVisible];
}

-(void) createLandingAsRoot{
  
    
  LandingVC *vc = [LandingVC new];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
 
  self.window.rootViewController = vc;
  [self.window makeKeyAndVisible];
}

- (void)applicationDidBecomeActive:(UIApplication *)application{
//   [UIApplication sharedApplication].applicationIconBadgeNumber = 0;

  
 }

-(void)applicationDidEnterBackground:(UIApplication *)application{
//   [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
 }


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
