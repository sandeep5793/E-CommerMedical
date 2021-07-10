//
//  LandingVC.m
//  ArascaMedical
//
//  Created by Apple on 13/01/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "LandingVC.h"
#import "AppDelegate.h"
#import <AVKit/AVKit.h>
#import "InitialVC.h"

@interface LandingVC ()

@end

@implementation LandingVC

- (void)viewDidLoad {
  [super viewDidLoad];
  
  //  self.view.backgroundColor = [UIColor redColor];
  
  
  
  [self playVideo];
  // Do any additional setup after loading the view.
}


-(void) playVideo{
  
  NSError *setCategoryError = nil;
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error: &setCategoryError];
  
  NSURL *url = [[NSBundle mainBundle] URLForResource:@"video2" withExtension:@"mov"];
  
  AVAsset *asset = [AVAsset assetWithURL:url];
  
  CMTime time = [asset duration];
  int seconds = ceil(time.value/time.timescale);
  NSLog(@"%d",seconds);
  AVPlayerItem *avPlayerItem = [[AVPlayerItem alloc]initWithAsset:asset];
  AVPlayer *songPlayer = [AVPlayer playerWithPlayerItem:avPlayerItem];
  AVPlayerLayer *avPlayerLayer = [AVPlayerLayer playerLayerWithPlayer: songPlayer];
  avPlayerLayer.frame = self.view.layer.bounds;
  UIView *newView = [[UIView alloc] initWithFrame:self.view.bounds];
  [newView.layer addSublayer:avPlayerLayer];
  [self.view addSubview:newView];
  [songPlayer play];
  [self goToMainRoot:seconds];
  
}

-(void) goToMainRoot:(int)time{
  
  NSTimer *timer = [NSTimer scheduledTimerWithTimeInterval:time repeats:NO block:^(NSTimer * _Nonnull timer) {
    
    UIStoryboard *story = [UIStoryboard storyboardWithName:@"Storyboard" bundle:nil];
    
    InitialVC *vw = [story instantiateViewControllerWithIdentifier:@"InitialVC"];
    self.view.window.rootViewController = vw;
    
    //        AppDelegate *delegate = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    //
    //        [delegate createReactAsRoot];
  }];
}
/*
 #pragma mark - Navigation
 
 // In a storyboard-based application, you will often want to do a little preparation before navigation
 - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
 // Get the new view controller using [segue destinationViewController].
 // Pass the selected object to the new view controller.
 }
 */

@end
