package com.arascamedicalgroup.paymentmodule;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;

import com.arascamedicalgroup.R;
import com.arascamedicalgroup.databinding.ActivityMainBinding;
import com.mastercard.gateway.android.sdk.Gateway;

public class MainActivity extends AppCompatActivity {

    ActivityMainBinding binding;
    TextChangeListener textChangeListener = new TextChangeListener();

    String amount="2.00";
    String orderId="";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = DataBindingUtil.setContentView(this, R.layout.activity_main);

        binding.merchantId.setText(Config.MERCHANT_ID.getValue(this));
        binding.merchantId.addTextChangedListener(textChangeListener);

        binding.region.setText(Config.REGION.getValue(this));
        binding.region.addTextChangedListener(textChangeListener);
        binding.region.setOnFocusChangeListener((v, hasFocus) -> {
            if (hasFocus) {
                binding.region.clearFocus();
                showRegionPicker();
            }
        });

        binding.merchantUrl.setText(Config.MERCHANT_URL.getValue(this));
        binding.merchantUrl.addTextChangedListener(textChangeListener);

        binding.processPaymentButton.setOnClickListener(v -> goTo(ProcessPaymentActivity.class));

        if (!getIntent().getExtras().getString("merchantId","").equalsIgnoreCase("")){
            binding.merchantId.setText(getIntent().getExtras().getString("merchantId",""));
            binding.merchantUrl.setText(getIntent().getExtras().getString("merchandServerUrl",""));
            amount = getIntent().getExtras().getString("amount","2.00");
            orderId = getIntent().getExtras().getString("orderId","");
            setRegion();
            binding.processPaymentButton.callOnClick();
        }
        enableButtons();
    }

    void goTo(Class klass) {
        Intent i = new Intent(this, klass);
        i.putExtra("amount",amount);
        i.putExtra("appOrderId",orderId);
        startActivity(i);
        finish();
    }

    void persistConfig() {
        Config.MERCHANT_ID.setValue(this, binding.merchantId.getText().toString());
        Config.REGION.setValue(this, binding.region.getText().toString());
        Config.MERCHANT_URL.setValue(this, binding.merchantUrl.getText().toString());

        // update api controller url
        ApiController.getInstance().setMerchantServerUrl(Config.MERCHANT_URL.getValue(this));
    }

    void enableButtons() {
        boolean enabled = !TextUtils.isEmpty(binding.merchantId.getText())
                && !TextUtils.isEmpty(binding.region.getText())
                && !TextUtils.isEmpty(binding.merchantUrl.getText());

        binding.processPaymentButton.setEnabled(enabled);
    }

    void showRegionPicker() {
        Gateway.Region[] regions = Gateway.Region.values();
        final String[] items = new String[regions.length + 1];
        items[0] = getString(R.string.none);
        for (int i = 0; i < regions.length; i++) {
            items[i + 1] = regions[i].name();
        }

        new AlertDialog.Builder(this)
                .setTitle(R.string.main_select_region)
                .setItems(items, (dialog, which) -> {
                    if (which == 0) {
                        binding.region.setText("");
                    } else {
                        binding.region.setText(items[which]);
                    }
                    dialog.cancel();
                })
                .show();
    }

    void setRegion() {
        Gateway.Region[] regions = Gateway.Region.values();
        final String[] items = new String[regions.length + 1];
        items[0] = getString(R.string.none);
        for (int i = 0; i < regions.length; i++) {
            items[i + 1] = regions[i].name();
        }
        binding.region.setText(items[5]);


    }

    class TextChangeListener implements TextWatcher {
        @Override
        public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

        }

        @Override
        public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            enableButtons();
            persistConfig();
        }

        @Override
        public void afterTextChanged(Editable editable) {

        }
    }
}
