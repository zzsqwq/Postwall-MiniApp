
<view class="index-hd">
    <image class="logo-class" src="../../images/syzx.png" mode="aspectFill"></image>
    <view class="index-desc">这里是胶州实验中学自助贴贴墙</view>
    <br></br>
    <navigator url="https://www.baidu.com" class="index-navigator">投稿指南及注意事项</navigator>
</view>

<form bind:submit="formSubmit" bindreset="formReset">
  <view class="section">
    <view class="section__title">投稿类型</view>
    <view class="input-section">
    <input class="input_text" name="input" maxlength="4" placeholder="不超过 4 个字（如表白、提问等）"  />
    </view>
  </view>
  <view class="section">
    <view class="section__title">投稿标题</view>
    <view class="input-section">
    <input class="input_text" name="input" maxlength="8" placeholder="不超过 8 个字" />
    </view>
  </view>

  <view class="section">
    <view class="section__title">内容文本</view>
    <textarea class="textarea_text" auto-height placeholder="在这里输入具体内容" placeholder-class="input_text-placeholder"/>
  </view>

  <view class="section">
    <view class="section__title">选择图片（点击图片可预览）</view>
    <view class="image-number-class">{{imageList.length}}/9</view>
  </view>

  <block qq:for="{{imageList}}" qq:for-item="image">
    <view class="upload-wrap__item">
      <image class="image-block"  src="{{image}}" data-src="{{image}}" bindtap="previewImage" mode="aspectFill" />
    </view>
  </block>

  <view qq:if="{{imageList.length<9}}"class="upload-wrap__item upload-wrap__item_default" bindtap="chooseImage">
    <image class="image-block" src="../../images/icon-add@2x.png" mode="aspectFill" />
  </view>

  <view class="section">
    <view class="section__title">联系方式</view>
    <view class="contact-block">
      <image class="contact-icon-class" src="../../images/pages/home/icon-qq-3.png" mode="aspectFill"></image>
      <input class="contact-input_text"  name="input" maxlength="11" placeholder="QQ"  />
    </view>
  </view>

  <view class="section-mid" >
    <view class="contact-block">
      <image class="contact-icon-class" src="../../images/pages/home/icon-wechat.png" mode="aspectFill"></image>
      <input class="contact-input_text"  name="input" maxlength="20" placeholder="微信"  />
    </view>
  </view>

  <view class="section-mid" >
    <view class="contact-block">
      <image class="contact-icon-phone-class"  src="../../images/pages/home/icon-phone.png" mode="aspectFill"></image>
      <input class="contact-input_text" name="input"  placeholder="邮箱"  />
    </view>
  </view>



  <view class="btn-area">
    <button type="primary" form-type="submit" style="margin: 0rpx auto 20rpx auto; width:90%">Submit</button>
    <button form-type="reset" style="margin: 0rpx auto 20rpx auto; width:90%" >Reset</button>
  </view>
</form>

 