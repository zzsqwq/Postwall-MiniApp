<!-- index.qml -->

<view>{{message}}</view>
<view qq:for="{{array}}">{{item}}</view>
<!-- if -->
<view qq:if="{{view == 'MINA'}}">1</view>
<view qq:if="{{view == 'APP'}}">2</view>
<view qq:if="{{view == 'WEBVIEW'}}">3</view>

<template name="staffName">
    <view>
        FirstName: {{firstName}},
        LastName: {{lastName}}
    </view>
</template>

<template is="staffName" data="{{...staffA}}"></template>
<template is="staffName" data="{{...staffB}}"></template>
<template is="staffName" data="{{...staffC}}"></template>