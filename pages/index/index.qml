<view class="index-hd">
    <image class="logo-class" src="../../images/ttq.jpg" mode="aspectFill"></image>
    <view class="index-desc">这里是自助贴贴墙</view>
    <view class="index-desc">下拉即可清空已填内容，带*项为必填</view>
    <navigator url="/pages/privacy/privacy" class="index-navigator">隐私协议说明</navigator>
</view>

<form bind:submit="formSubmit" bindreset="formReset" id="total-form">
    <view class="section">
        <view class="section__title">投稿类型*</view>
<!--        <view class="input-section">-->
<!--            <input value="{{post_type_value}}" class="input_text" name="post_type" maxlength="4" placeholder="不超过 4 个字（如表白、提问等）"/>-->
<!--        </view>-->
        <picker bindchange="bindPickerChange" value="{{type_index}}" range="{{type_array}}" name="post_type">
        <view class="picker-class">
            当前类型：{{type_array[type_index]}}
        </view>
        </picker>
    </view>
    <view class="section">
        <view class="section__title">投稿标题*</view>
        <view class="input-section">
            <input value="{{post_title_value}}" class="input_text" name="post_title" maxlength="8" placeholder="不超过 8 个字"/>
        </view>
    </view>

    <view class="section">
        <view class="section__title">内容文本*</view>
        <textarea value="{{post_text_value}}" class="textarea_text" name="post_text" auto-height placeholder="在这里输入具体内容"
                  placeholder-class="input_text-placeholder"/>
    </view>

    <view class="section">
        <view class="section__title">选择图片（点击图片可预览）</view>
        <view class="image-number-class">{{imageList.length}}/9</view>
    </view>

    <block qq:for="{{imageList}}" qq:for-item="image">
        <view class="image-combine">
            <image class="image-block" src="{{image}}" data-index="{{index}}" bindtap="previewImage" mode="aspectFill"/>
            <image class="delete-button" data-index="{{index}}" src="../../images/pages/home/icon-delete.png"
                   bindtap="deleteImage" mode="aspectFill"/>
        </view>
    </block>

    <view qq:if="{{imageList.length<9}}" class="upload-wrap__item upload-wrap__item_default" bindtap="chooseImage">
        <image class="image-combine" src="../../images/icon-add@2x.png" mode="aspectFill"/>
    </view>

    <view class="section">
        <view class="section__title">联系方式（非必填）</view>
        <view class="contact-block">
            <image class="contact-icon-class" src="../../images/pages/home/icon-qq-3.png" mode="aspectFill"></image>
            <input value="{{contact_qq_value}}" class="contact-input_text" name="post_contact_qq" maxlength="11" placeholder="QQ"/>
        </view>
    </view>

    <view class="section-mid">
        <view class="contact-block">
            <image class="contact-icon-class" src="../../images/pages/home/icon-wechat.png" mode="aspectFill"></image>
            <input value="{{contact_wechat_value}}"  class="contact-input_text" name="post_contact_wechat" maxlength="20" placeholder="微信"/>
        </view>
    </view>

    <view class="section-mid">
        <view class="contact-block">
            <image class="contact-icon-phone-class" src="../../images/pages/home/icon-phone.png"
                   mode="aspectFill"></image>
            <input value="{{contact_tel_value}}" class="contact-input_text" name="post_contact_tel" maxlength="11" placeholder="联系电话"/>
        </view>
    </view>


    <view class="btn-area">
        <button type="primary" form-type="submit" style="margin: 0rpx auto 20rpx auto; width:90%">提交</button>
        <button form-type="reset" style="margin: 0rpx auto 50rpx auto; width:90%">清空已填内容</button>
    </view>
</form>

<view class="privacy-container">
    <view class="privacy-1">使用此小程序即代表您同意以下</view>

    <navigator url="/pages/privacy/privacy" class="privacy-navigator"> 《隐私说明》</navigator>
</view>
 