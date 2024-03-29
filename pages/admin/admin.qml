<view class="container">
    <!-- <canvas class = "canvas-class" style="width: 300px; height: 200px;" canvas-id="firstCanvas"></canvas>
        <image style="width: 300px; height: 200px" src="{{tmp_img}}" mode="aspectFill"></image> -->
    <view class="index-hd">
        <!--        <view class="userinfo">-->
        <!--            <block qq:if="{{!hasUserInfo && canIUse}}">-->
        <!--                <image class="userinfo-avatar" src="../../images/pages/index/default-avatar.png"-->
        <!--                       mode="aspectFill"></image>-->
        <!--                <button class="default-nickname" open-type="getUserInfo" bindgetuserinfo="getUserInfo">点击获取头像昵称-->
        <!--                </button>-->
        <!--            </block>-->
        <!--            <block qq:else>-->
        <!--                <image bind:tap="previewAvatar" class="userinfo-avatar" src="{{userInfo.avatarUrl}}"-->
        <!--                       mode="aspectFill"></image>-->
        <!--                <text class="userinfo-nickname">{{userInfo.nickName}}</text>-->
        <!--            </block>-->
        <!--        </view>-->
        <image class="logo-class" src="../../images/ttq.jpg" mode="aspectFill"></image>
        <view class="index-desc" style="color:red;">图片加载有一定延迟，左滑可选择删除订单~</view>
        <navigator url="https://www.baidu.com" class="index-navigator">审核指南及墙机守则，请务必严格遵守！</navigator>
    </view>
    <view class="index-hd" style="padding: 64rpx 0rpx;">
        <view class="list-wrap">
            <block qq:if="{{postList.length !== 0 && isAdmin === true}}">
                <view qq:if="{{!isRecently}}" style="margin: 0rpx 0rpx 40rpx 0rpx; color: red; ">目前有 {{allPostNum}} 个订单尚未发布</view>
                <view qq:if="{{isRecently}}" style="margin: 0rpx 0rpx 40rpx 0rpx; color: gray; ">目前有 {{allPostNum}} 个订单可恢复</view>
            </block>
            <block qq:if="{{postList.length === 0}}">
                <view>还没有任何订单已投递！</view>
            </block>
            <block qq:else qq:for="{{postList}}" qq:for-index="idx" qq:key="{{item._id}}">
                <view class="list-wrap__group {{item.open ? 'list-wrap__group_expand' : 'list-wrap__group_collapse'}}">
                    <movable-area class="move-area-class"
                                  style="{{isAdmin === true ? 'width: calc(100vw - 240rpx)' : 'width: calc(100vw - 120rpx)'}}">
                        <movable-view out-of-bounds="true" direction="horizontal" x="{{item.xmove}}"
                                      inertia="true"
                                      data-productIndex="{{idx}}"
                                      bindtouchstart="handleTouchStart"
                                      bindtouchend="handleTouchEnd"
                                      bindchange="handleMovableChange"
                                      class="move-view-class">
                            <view id="{{item._id}}" class="list-wrap__group-hd" data-id="{{idx}}" bindtap="kindToggle">
                                <text class="list-wrap__group-title"
                                      data-id="{{idx}}">{{"[" + item.post_type + "]" + item.post_title }}</text>
                                <text qq:if="{{isAdmin === true}}"
                                      class="choose-notify">{{ "已选择" + "[" + selectCounter[idx] + "/" + item.image_list.length + "]"
                                    }}</text>

                                <text qq:if="{{isAdmin === false && item.post_done == true && !item.post_reject}}"
                                      class="done-notify">订单已发布</text>
                                <text qq:if="{{isAdmin === false && item.post_done == false && !item.post_reject}}"
                                      class="donenot-notify">订单未发布</text>
                                <text qq:if="{{isAdmin == false && item.post_reject}}"
                                      class="reject-notify">订单已拒发</text>
                                <!--                        <image class="list-wrap__group-icon"-->
                                <!--                               src="{{'https://q1.qlogo.cn/g?b=qq&nk='+item.post_contact_qq+'&s=640'}}"-->
                                <!--                               mode="aspectFill"/>-->
                            </view>
                        </movable-view>
                    </movable-area>
                    <view qq:if="{{isRecently}}" class="delete-btn " style="background: #00CAFC;" data-id="{{idx}}"
                          bindtap="handleRecoverPost">恢复
                    </view>
                    <view qq:if="{{!isRecently}}" class="delete-btn " style="background: #00CAFC;" data-id="{{idx}}"
                          bindtap="handleDeletePost">清除
                    </view>
                    <view qq:if="{{isAdmin && !isRecently}}" class="delete-btn" style="right: 120rpx;" data-id="{{idx}}"
                          bindtap="handleRejectPost">拒绝
                    </view>
                    <view class="list-wrap__group-bd">
                        <!--                        <block class="image-block" qq:for="{{item.image_list}}" qq:for-item="image">-->
                        <!--                            <image class="result-photo-class" src="{{image}}" mode="aspectFill"></image>-->
                        <!--                        </block>-->
                        <view class="imgList">
                            <swiper indicator-dots='true' duration='1000'
                                    circular='true' style="height: 650rpx">
                                <!--                                <swiper-item>-->
                                <!--                                    <canvas data-index="0" class="result-photo-class" canvas-id="{{item._id}}"></canvas>-->
                                <!--                                    <image data-item="{{idx}}" id="0" bind:tap="selectImg" qq:if="{{isSelected[idx][0]}}" class="test-class" src="../../images/pages/index/selected.png"></image>-->
                                <!--                                    <image data-item="{{idx}}" id="0" bind:tap="selectImg" qq:if="{{!isSelected[idx][0]}}" class="test-class" src="../../images/pages/index/Unselected.png"></image>-->
                                <!--                                </swiper-item>-->
                                <block qq:for="{{item.image_list}}" qq:for-item="image" qq:for-index="index" qq:key="*this">
                                    <swiper-item>
                                        <image src='{{image}}' bindtap="previewImg" data-index='{{index}}'
                                               data-id="{{idx}}" class="img" mode="aspectFit"></image>
                                        <image data-item="{{idx}}" id="{{index}}" bindtap="selectImg"
                                               qq:if="{{isAdmin == true && isSelected[idx][index]}}"
                                               class="test-class" src="../../images/pages/index/selected.png"></image>
                                        <image data-item="{{idx}}" id="{{index}}" bindtap="selectImg"
                                               qq:if="{{isAdmin == true && !isSelected[idx][index] }}"
                                               class="test-class" src="../../images/pages/index/Unselected.png"></image>
                                    </swiper-item>
                                </block>
                            </swiper>
                        </view>
                    </view>
                </view>
            </block>
        </view>
    </view>
</view>
<view  class="btn-area" qq:if="{{isAdmin && !isRecently}}">
    <button type="warn" bindtap="deleteAll" style="margin: 0rpx auto 20rpx 5%; width:43%; display: inline-block;">清除当页
    </button>
    <button type="primary" bindtap="publishAll" style="margin: 0rpx auto 20rpx 4%; width:43%; display: inline-block;">
        发布当页
    </button>
</view>
<view  class="btn-area" qq:if="{{isAdmin && isRecently}}">
    <button type="warn" bindtap="prePage" style="margin: 0rpx auto 20rpx 5%; width:43%; display: inline-block;">上一页
    </button>
    <button type="primary" bindtap="nextPage" style="margin: 0rpx auto 20rpx 4%; width:43%; display: inline-block;">
        下一页
    </button>
</view>

<view class="btn-area" qq:if="{{isAdmin}}">
    <button type="primary" bindtap="toQzone" style="margin: 0rpx auto 20rpx auto; width:90%">发布！</button>
</view>
<view class="btn-area" qq:if="{{isAdmin}}">
    <button qq:if="{{!isRecently}}" type="default" bindtap="switchToRecently" style="margin: 0rpx auto 20rpx auto; width:90%">查看近期发布</button>
    <button qq:if="{{isRecently}}" type="default" bindtap="switchToRecently" style="margin: 0rpx auto 20rpx auto; width:90%">查看等待发布</button>
</view>

<view class="privacy-container">
    <view class="privacy-1" style="margin: 0rpx auto 20rpx auto;">当前版本 {{appInstance.version}}</view>
    <view class="privacy-1">使用此小程序即代表您同意以下</view>

    <navigator url="/pages/privacy/privacy" class="privacy-navigator">《隐私说明》</navigator>
</view>
