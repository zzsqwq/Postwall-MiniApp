<view class="container">
    <!-- <canvas class = "canvas-class" style="width: 300px; height: 200px;" canvas-id="firstCanvas"></canvas>
        <image style="width: 300px; height: 200px" src="{{tmp_img}}" mode="aspectFill"></image> -->
    <view class="index-hd">
        <view class="userinfo">
            <block qq:if="{{!hasUserInfo && canIUse}}">
                <image class="userinfo-avatar" src="../../images/pages/index/default-avatar.png"
                       mode="aspectFill"></image>
                <button class="default-nickname" open-type="getUserInfo" bindgetuserinfo="getUserInfo">点击获取头像昵称
                </button>
            </block>
            <block qq:else>
                <image bind:tap="previewAvatar" class="userinfo-avatar" src="{{userInfo.avatarUrl}}"
                       mode="aspectFill"></image>
                <text class="userinfo-nickname">{{userInfo.nickName}}</text>
            </block>
        </view>
        <view class="index-desc">图片加载有一定延迟，左滑可选择删除订单~</view>
        <navigator url="https://www.baidu.com" class="index-navigator">审核指南及墙机守则，请务必严格遵守！</navigator>
    </view>
    <view class="index-hd">
        <view class="list-wrap">
            <block qq:if="{{datalist.length == 0}}">
            <view> 还没有任何订单已投递！</view>
            </block>
            <block qq:else qq:for="{{datalist}}" qq:for-index="idx" qq:key="{{item._id}}">
                <view class="list-wrap__group {{item.open ? 'list-wrap__group_expand' : 'list-wrap__group_collapse'}}">
                    <movable-area class="move-area-class">
                    <movable-view out-of-bounds="true" direction="horizontal" x="{{item.xmove}}"
                                  inertia="true"
                                  data-productIndex="{{idx}}"
                                  bindtouchstart="handleTouchStart"
                                  bindtouchend="handleTouchEnd"
                                  bindchange="handleMovableChange"
                                  class="move-view-class">
                    <view id="{{item._id}}" class="list-wrap__group-hd" bindtap="kindToggle">
                        <text class="list-wrap__group-title">{{"[" + item.post_type + "]" + item.post_title }}</text>
                        <text qq:if="{{is_admin == true}}" class="choose-notify">{{ "已选择" + "[" + rowscount[idx] + "/" + item.image_list.length + "]" }}</text>

                        <text qq:if="{{is_admin == false && item.post_done == true}}" class="done-notify">订单已发布</text>
                        <text qq:if="{{is_admin == false && item.post_done == false}}" class="donenot-notify">订单未发布</text>
<!--                        <image class="list-wrap__group-icon"-->
<!--                               src="{{'https://q1.qlogo.cn/g?b=qq&nk='+item.post_contact_qq+'&s=640'}}"-->
<!--                               mode="aspectFill"/>-->
                    </view>
                    </movable-view>
                    </movable-area>
                    <view class="delete-btn" data-id="{{idx}}" bindtap="handleDeleteProduct">删除</view>
                    <view class="list-wrap__group-bd">
                        <!--                        <block class="image-block" qq:for="{{item.image_list}}" qq:for-item="image">-->
                        <!--                            <image class="result-photo-class" src="{{image}}" mode="aspectFill"></image>-->
                        <!--                        </block>-->
                        <view class="imgList">
                            <swiper indicator-dots='true'  duration='1000'
                                    circular='true' style="height: 650rpx">
                                <!--                                <swiper-item>-->
                                <!--                                    <canvas data-index="0" class="result-photo-class" canvas-id="{{item._id}}"></canvas>-->
                                <!--                                    <image data-item="{{idx}}" id="0" bind:tap="selectImg" qq:if="{{chooseornot[idx][0]}}" class="test-class" src="../../images/pages/index/selected.png"></image>-->
                                <!--                                    <image data-item="{{idx}}" id="0" bind:tap="selectImg" qq:if="{{!chooseornot[idx][0]}}" class="test-class" src="../../images/pages/index/Unselected.png"></image>-->
                                <!--                                </swiper-item>-->
                                <block qq:for="{{item.image_list}}" qq:for-item="image" qq:for-index="index" >
                                    <swiper-item>
                                        <image src='{{image}}'  bind:tap="previewImg" data-index='{{index}}' data-id="{{idx}}" class="img" mode="aspectFit"></image>
                                        <image data-item="{{idx}}" id="{{index}}" bind:tap="selectImg" qq:if="{{is_admin == true && chooseornot[idx][index]}}" class="test-class" src="../../images/pages/index/selected.png"></image>
                                        <image data-item="{{idx}}" id="{{index}}" bind:tap="selectImg" qq:if="{{is_admin == true && !chooseornot[idx][index] }}" class="test-class" src="../../images/pages/index/Unselected.png"></image>
                                    </swiper-item>
                                </block>
                            </swiper>
                        </view>
                        <!--                        <image class="result-photo-class" src="{{item.temp}}"></image>-->
                        <!--                        <block qq:for-items="{{item.pages}}" qq:for-item="page" qq:key="*item">-->
                        <!--                            <navigator url="pages/{{page.path}}/{{page.path}}" class="list-wrap__item">-->
                        <!--                                <view class="list-wrap__item-bd">-->
                        <!--                                    <text class="list-wrap__txt-title">{{page.name}}</text>-->
                        <!--                                    <image class="list-wrap__group-icon-more" src="../../image/common/icon-arrow-right@2x.svg"  mode="aspectFill" />-->
                        <!--                                </view>-->
                        <!--                                <view class="list-wrap__item-ft"></view>-->
                        <!--                            </navigator>-->
                        <!--                        </block>-->
                        <!--                        <image class="test-class"-->
                        <!--                               src="{{'https://q1.qlogo.cn/g?b=qq&nk='+item.post_contact_qq+'&s=640'}}"-->
                        <!--                               mode="aspectFill"/>-->
                    </view>
                </view>
            </block>
    </view>
</view>
</view>
<view class="btn-area" qq:if="{{is_admin == true}}">
    <button type="primary" bind:tap="toQzone" style="margin: 0rpx auto 20rpx auto; width:90%">发布！</button>
</view>
