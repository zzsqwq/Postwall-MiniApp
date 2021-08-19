
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
    <textarea class="textarea_text" auto-height placeholder="在这里输入具体内容" placeholder-class="input_text-placeholder"/>
  </view>


  <view class="btn-area">
    <button form-type="submit">Submit</button>
    <button form-type="reset">Reset</button>
  </view>
</form>

 
 <view class="qui-cell-group">
        <view class="qui-cell-group__bd">
          <view class="qui-cell">
            <view class="qui-cell__bd">
              <text class="qui-cell__txt-label">点击可预览选好的图片</text>
            </view>
            <view class="qui-cell__ft">
              <text class="qui-cell__txt-tips">{{imageList.length}}/9</text>
            </view>
          </view>

          <view class="qui-cell">
            <view class="qui-cell__bd">

              <view class="upload-wrap">
                <view class="upload-wrap__bd">
                  <block qq:for="{{imageList}}" qq:for-item="image">
                    <view class="upload-wrap__item">
                      <image class="upload-wrap__img"  src="{{image}}" data-src="{{image}}" bindtap="previewImage" mode="aspectFill" />
                    </view>
                  </block>

                  <view class="upload-wrap__item upload-wrap__item_default" bindtap="chooseImage">
                    <image class="upload-wrap__img" src="../../../../image/icon-add@2x.png" mode="aspectFill" />
                  </view>
                </view>
              </view>

            </view>
          </view>


        </view>
      </view>