package com.arascamedicalgroup.paymentmodule;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.InputFilter;
import android.text.Spanned;
import android.text.TextWatcher;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.PopupMenu;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;

import com.arascamedicalgroup.R;
import com.arascamedicalgroup.databinding.ActivityCollectCardInfoBinding;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.PaymentDataRequest;
import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.WalletConstants;
import com.mastercard.gateway.android.sdk.Gateway;
import com.mastercard.gateway.android.sdk.GatewayGooglePayCallback;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;

import static android.text.TextUtils.isEmpty;

public class CollectCardInfoActivity extends AppCompatActivity {

    private static final String EXTRA_PREFIX = "com.mastercard.gateway.sample.EXTRA_";

    // request
    public static final String EXTRA_GOOGLE_PAY_TXN_AMOUNT = EXTRA_PREFIX + "GOOGLE_PAY_TXN_AMOUNT";
    public static final String EXTRA_GOOGLE_PAY_TXN_CURRENCY = EXTRA_PREFIX + "GOOGLE_PAY_TXN_CURRENCY";

    // response
    public static final String EXTRA_CARD_DESCRIPTION = EXTRA_PREFIX + "CARD_DESCRIPTION";
    public static final String EXTRA_CARD_NAME = EXTRA_PREFIX + "CARD_NAME";
    public static final String EXTRA_CARD_NUMBER = EXTRA_PREFIX + "CARD_NUMBER";
    public static final String EXTRA_CARD_EXPIRY_MONTH = EXTRA_PREFIX + "CARD_EXPIRY_MONTH";
    public static final String EXTRA_CARD_EXPIRY_YEAR = EXTRA_PREFIX + "CARD_EXPIRY_YEAR";
    public static final String EXTRA_CARD_CVV = EXTRA_PREFIX + "CARD_CVC";
    public static final String EXTRA_PAYMENT_TOKEN = EXTRA_PREFIX + "PAYMENT_TOKEN";


    ActivityCollectCardInfoBinding binding;
    String googlePayTxnAmount;
    String googlePayTxnCurrency;
    PaymentsClient paymentsClient;
    TextChangeListener textChangeListener = new TextChangeListener();
    GooglePayCallback googlePayCallback = new GooglePayCallback();


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = DataBindingUtil.setContentView(this, R.layout.activity_collect_card_info);

        // get bundle extras and set txn amount and currency for google pay
        Intent i = getIntent();
        googlePayTxnAmount = i.getStringExtra(EXTRA_GOOGLE_PAY_TXN_AMOUNT);
        googlePayTxnCurrency = i.getStringExtra(EXTRA_GOOGLE_PAY_TXN_CURRENCY);

        // init manual text field listeners
        binding.nameOnCard.requestFocus();
        binding.nameOnCard.addTextChangedListener(textChangeListener);
        binding.cardnumber.addTextChangedListener(textChangeListener);
        binding.expiryMonth.addTextChangedListener(textChangeListener);
        binding.expiryYear.addTextChangedListener(textChangeListener);
        binding.cvv.addTextChangedListener(textChangeListener);

        binding.submitButton.setEnabled(false);
        binding.submitButton.setOnClickListener(v -> continueButtonClicked());


        // init Google Pay client
        paymentsClient = Wallet.getPaymentsClient(this, new Wallet.WalletOptions.Builder()
                .setEnvironment(WalletConstants.ENVIRONMENT_TEST)
                .build());

        // init google pay button
        binding.googlePayButton.setOnClickListener(v -> googlePayButtonClicked());

        binding.cancelButton.setOnClickListener(v-> onBackPressed());
        // check if Google Pay is available
        isReadyToPay();


        binding.layoutmonth.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                PopupMenu popup = new PopupMenu(CollectCardInfoActivity.this, view);
                for (int i =1 ; i<=12 ; i++){
                    if (i<10){
                        popup.getMenu().add("0"+i);
                    }
                    else {
                        popup.getMenu().add(""+i);
                    }
                }
                popup.show();
                popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    @Override
                    public boolean onMenuItemClick(MenuItem item) {

                        binding.expiryMonth.setText(item.getTitle());

                        return false;
                    }
                });

            }
        });

        binding.layoutyear.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {




                //here

                PopupMenu popup = new PopupMenu(CollectCardInfoActivity.this, view);
                DateFormat df = new SimpleDateFormat("yy"); // Just the year, with 2 digits
                String formattedDate = df.format(Calendar.getInstance().getTime());
                int a = Integer.parseInt(formattedDate);
                for (int i = a; i <= a + 50; i++) {
                    popup.getMenu().add("" + i);
                }


                popup.show();
                popup.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
                    @Override
                    public boolean onMenuItemClick(MenuItem item) {

                        binding.expiryYear.setText(item.getTitle());

                        return false;
                    }
                });

            }
        });


        binding.nameOnCard.setFilters(new InputFilter[] {
                new InputFilter() {
                    @Override
                    public CharSequence filter(CharSequence cs, int start,
                                               int end, Spanned spanned, int dStart, int dEnd) {
                        // TODO Auto-generated method stub
                        if(cs.equals("")){ // for backspace
                            return cs;
                        }
                        if(cs.toString().matches("[a-zA-Z ]+")){
                            return cs;
                        }
                        if (cs.toString().matches("[0-9]+")){
                            return cs.toString().replaceAll("[0-9]","");
                        }
                        return "";

                    }
                }
        });
    }
    private boolean validate() {
        return binding.cardnumber.getText().toString().trim().length() == 16;
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        // handle the Google Pay lifecycle
        if (Gateway.handleGooglePayResult(requestCode, resultCode, data, googlePayCallback)) {
            return;
        }

        super.onActivityResult(requestCode, resultCode, data);
    }

    void enableContinueButton() {
        if (isEmpty(binding.nameOnCard.getText()) || isEmpty(binding.cardnumber.getText())
                || isEmpty(binding.expiryMonth.getText()) || isEmpty(binding.expiryYear.getText())
                || isEmpty(binding.cvv.getText()) || (binding.cvv.getText().toString().length() < 3)) {

            binding.submitButton.setEnabled(false);
        } else {
            binding.submitButton.setEnabled(true);
        }
    }

    void continueButtonClicked() {
        if ( validate()){
            String nameOnCard = binding.nameOnCard.getText().toString();
            String cardNumber = binding.cardnumber.getText().toString();
            String expiryMM = binding.expiryMonth.getText().toString();
            String expiryYY = binding.expiryYear.getText().toString();
            String cvv = binding.cvv.getText().toString();

            Intent i = new Intent();
            i.putExtra(EXTRA_CARD_DESCRIPTION, maskCardNumber(cardNumber));
            i.putExtra(EXTRA_CARD_NAME, nameOnCard);
            i.putExtra(EXTRA_CARD_NUMBER, cardNumber);
            i.putExtra(EXTRA_CARD_EXPIRY_MONTH, expiryMM);
            i.putExtra(EXTRA_CARD_EXPIRY_YEAR, expiryYY);
            i.putExtra(EXTRA_CARD_CVV, cvv);

            setResult(Activity.RESULT_OK, i);
            finish();
        }
        else {
            Toast.makeText(CollectCardInfoActivity.this,"Card Not Valid",Toast.LENGTH_SHORT).show();
            binding.cardnumber.setError("Card Not Valid");
        }
    }

    void googlePayButtonClicked() {
        try {
            PaymentDataRequest request = PaymentDataRequest.fromJson(getPaymentDataRequest().toString());
            if (request != null) {
                // use the Gateway convenience handler for launching the Google Pay flow
                Gateway.requestGooglePayData(paymentsClient, request, CollectCardInfoActivity.this);
            }
        } catch (JSONException e) {
            Toast.makeText(this, "Could not request payment data", Toast.LENGTH_SHORT).show();
        }
    }

    void returnCardInfo(JSONObject paymentData) {
        Intent i = new Intent();

        try {
            JSONObject paymentMethodData = paymentData.getJSONObject("paymentMethodData");
            String description = paymentMethodData.getString("description");
            String token = paymentMethodData.getJSONObject("tokenizationData")
                    .getString("token");

            i.putExtra(EXTRA_CARD_DESCRIPTION, description);
            i.putExtra(EXTRA_PAYMENT_TOKEN, token);

            setResult(Activity.RESULT_OK, i);
        } catch (Exception e) {
            setResult(Activity.RESULT_CANCELED, i);
        }

        finish();
    }

    String maskCardNumber(String number) {
        int maskLen = number.length() - 4;
        char[] mask = new char[maskLen];
        Arrays.fill(mask, '*');
        return new String(mask) + number.substring(maskLen);
    }

    void isReadyToPay() {
        try {
            IsReadyToPayRequest request = IsReadyToPayRequest.fromJson(getIsReadyToPayRequest().toString());

            Task<Boolean> task = paymentsClient.isReadyToPay(request);
            task.addOnCompleteListener(task12 -> {
                try {
                    boolean result = task12.getResult(ApiException.class);
                    if (result) {
                        // Show Google as payment option.
                        binding.orSeparator.setVisibility(View.VISIBLE);
                        binding.googlePayButton.setVisibility(View.VISIBLE);
                    } else {
                        // Hide Google as payment option.
                        binding.orSeparator.setVisibility(View.GONE);
                        binding.googlePayButton.setVisibility(View.GONE);
                    }
                } catch (ApiException e) {
                }
            });
        } catch (JSONException e) {
            // do nothing
        }
    }

    JSONObject getIsReadyToPayRequest() throws JSONException {
        return getBaseRequest()
                .put("allowedPaymentMethods", new JSONArray()
                        .put(getBaseCardPaymentMethod()));
    }

    JSONObject getCardPaymentMethod() throws JSONException {
        return getBaseCardPaymentMethod()
                .put("tokenizationSpecification", getTokenizationSpecification());
    }

    JSONObject getBaseRequest() throws JSONException {
        return new JSONObject()
                .put("apiVersion", 2)
                .put("apiVersionMinor", 0);
    }

    JSONObject getBaseCardPaymentMethod() throws JSONException {
        return new JSONObject()
                .put("type", "CARD")
                .put("parameters", new JSONObject()
                        .put("allowedAuthMethods", getAllowedCardAuthMethods())
                        .put("allowedCardNetworks", getAllowedCardNetworks()));
    }

    JSONArray getAllowedCardNetworks() {
        return new JSONArray()
                .put("AMEX")
                .put("DISCOVER")
                .put("MASTERCARD")
                .put("VISA");
    }

    JSONArray getAllowedCardAuthMethods() {
        return new JSONArray()
                .put("PAN_ONLY")
                .put("CRYPTOGRAM_3DS");
    }

    JSONObject getTokenizationSpecification() throws JSONException {
        return new JSONObject()
                .put("type", "PAYMENT_GATEWAY")
                .put("parameters", new JSONObject()
                        .put("gateway", "mpgs")
                        .put("gatewayMerchantId", Config.MERCHANT_ID.getValue(this)));
    }

    JSONObject getTransactionInfo() throws JSONException {
        return new JSONObject()
                .put("totalPrice", googlePayTxnAmount)
                .put("totalPriceStatus", "FINAL")
                .put("currencyCode", googlePayTxnCurrency);
    }

    JSONObject getMerchantInfo() throws JSONException {
        return new JSONObject()
                .put("merchantName", "Example Merchant");
    }

    JSONObject getPaymentDataRequest() throws JSONException {
        return getBaseRequest()
                .put("allowedPaymentMethods", new JSONArray()
                        .put(getCardPaymentMethod()))
                .put("transactionInfo", getTransactionInfo())
                .put("merchantInfo", getMerchantInfo());
    }

    class TextChangeListener implements TextWatcher {
        @Override
        public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

        }

        @Override
        public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            enableContinueButton();
        }

        @Override
        public void afterTextChanged(Editable editable) {

        }
    }

    class GooglePayCallback implements GatewayGooglePayCallback {
        @Override
        public void onReceivedPaymentData(JSONObject paymentData) {
            try {
                String description = paymentData.getJSONObject("paymentMethodData")
                        .getString("description");

                Log.d(GooglePayCallback.class.getSimpleName(), "ReceivedPaymentData: " + description);
            } catch (Exception e) {

            }

            returnCardInfo(paymentData);
        }

        @Override
        public void onGooglePayCancelled() {
            Log.d(GooglePayCallback.class.getSimpleName(), "Cancelled");
        }

        @Override
        public void onGooglePayError(Status status) {
            Log.d(GooglePayCallback.class.getSimpleName(), "Error");
            Toast.makeText(CollectCardInfoActivity.this, "Google Pay Error", Toast.LENGTH_SHORT).show();
        }
    }
}
