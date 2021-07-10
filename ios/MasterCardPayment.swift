//
//  MasterCardPayment.swift
//  ArascaMedical
//
//  Created by admin on 18/03/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import NVActivityIndicatorView

@objc(MasterCardPayment)
class MasterCardPayment: NSObject {
  
  
  @objc(addEvent:location:date:callback:)
  func addEvent(name: String, location: String, date: NSNumber, callback: (NSDictionary) -> () ) -> Void {
    // Date is ready to use!
    NSLog("%@ %@ %@", name, location, date)
    callback( [
      "name": name,
      "location": location,
      "date" : date
    ])
  }
  
  
  @objc(findEvents:callback:)
  func findEvents(paymentMethodDetail: NSDictionary,  callback: @escaping (NSArray) -> () ) {

    DispatchQueue.main.async {
    let storyBoard = UIStoryboard(name: "Storyboard", bundle: nil)
    let destVC = storyBoard.instantiateViewController(withIdentifier: "ProcessPaymentViewController") as? ProcessPaymentViewController
    destVC?.configure(merchantId: "\(paymentMethodDetail["merchantId"] ?? "")" , regionValue: "\(paymentMethodDetail["region"] ?? "")" , merchantServiceURL: "\(paymentMethodDetail["merchandServerUrl"] ?? "")", price: "\(paymentMethodDetail["amount"] ?? "")", orderId: "\(paymentMethodDetail["orderId"] ?? "")")
    
    destVC?.testResp = { [weak self] (data) in
     
      let demo =  NSArray.init(object: data)
      callback(demo)
    }
    
    destVC?.amount = "\(paymentMethodDetail["amount"] ?? "")"
    destVC?.orderId = "\(paymentMethodDetail["orderId"] ?? "")"
    self.getTopMostViewController()?.present(destVC!, animated: true, completion: nil)
    }
  
    
  }
  
 
  
  //MARK::- Get ViewController
  func getTopMostViewController(base: UIViewController? = UIApplication.shared.keyWindow?.rootViewController) -> UIViewController? {
    if let nav = base as? UINavigationController {
      return getTopMostViewController(base: nav.visibleViewController)
    }
    if let tab = base as? UITabBarController {
      if let selected = tab.selectedViewController {
        return getTopMostViewController(base: selected)
      }
    }
    if let presented = base?.presentedViewController {
      return getTopMostViewController(base: presented)
    }
    return base
  }
  
}


