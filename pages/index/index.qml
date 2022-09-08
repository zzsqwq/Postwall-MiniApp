<view class="index-hd">
    <image class="logo-class" src="../../images/ttq.jpg" mode="aspectFill"></image>
    <view class="index-desc" style="color:red;">请勿点击白色输入区域滑动、请点击灰色区域滑动</view>
    <view class="index-desc">下拉即可清空已填内容，带*项为必填</view>
    <navigator url="/pages/privacy/privacy" class="index-navigator">隐私协议说明</navigator>
</view>

<form bind:submit="formSubmit" bindreset="formReset" id="total-form">
    <view class="section">
        <view class="section__title">投稿类型*</view>
        <!--        <view class="input-section">-->
        <!--            <input value="{{post_type_value}}" class="input_text" name="post_type" maxlength="4" placeholder="不超过 4 个字（如表白、提问等）"/>-->
        <!--        </view>-->
        <view class="input-section">
            <picker bindchange="bindPickerChange" value="{{chosenTypeIndex}}" range="{{postTypeArray}}" name="post_type">
                <view class="picker-class">当前类型：{{postTypeArray[chosenTypeIndex]}}</view>
            </picker>
        </view>
    </view>

    <view class="section">
        <view class="section__title">投稿标题*</view>
        <view class="input-section">
            <input value="{{post_title_value}}" bindinput="input_title_blur" class="input_text" name="post_title"
                   maxlength="10" placeholder="不超过 8 个字"/>
        </view>
    </view>

    <view class="section">
        <view class="section__title">内容文本*</view>
        <view class="input-section">
            <textarea value="{{post_text_value}}" bindinput="input_text_blur" class="textarea_text" name="post_text"
                      auto-height placeholder="在这里输入具体内容"
                      maxlength="-1"/>
        </view>
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
            <input value="{{contact_qq_value}}" bindinput="contact_qq_blur" class="contact-input_text"
                   name="post_contact_qq" maxlength="11" placeholder="QQ"/>
        </view>
    </view>

    <view class="section-mid">
        <view class="contact-block">
            <image class="contact-icon-class" src="../../images/pages/home/icon-wechat.png" mode="aspectFill"></image>
            <input value="{{contact_wechat_value}}" bindinput="contact_wechat_blur" class="contact-input_text"
                   name="post_contact_wechat" maxlength="20" placeholder="微信"/>
        </view>
    </view>

    <view class="section-mid">
        <view class="contact-block">
            <image class="contact-icon-phone-class" src="../../images/pages/home/icon-phone.png"
                   mode="aspectFill"></image>
            <input value="{{contact_tel_value}}" bindinput="contact_tel_blur" class="contact-input_text"
                   name="post_contact_tel" maxlength="11" placeholder="联系电话"/>
        </view>
    </view>


    <view class="btn-area">
        <button type="primary" bindtap="bindSubmit" style="margin: 0rpx auto 20rpx auto; width:90%">提交</button>
        <button bindtap="bindReset" style="margin: 0rpx auto 20rpx auto; width:90%">清空已填内容</button>
        <button type="default" open-type="openGroupProfile" group-id="421976351" style="width:90%; background:gary;">
            点击加群反馈问题
        </button>
    </view>
</form>

<tui-footer copyright="Copyright © 2021-2022 胶州实高自助贴贴墙." navigate="{{navigate}}"></tui-footer>
