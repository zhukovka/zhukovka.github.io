---
layout: post
title:  "Относительные размеры в iOS"
subtitle: "Размеры в процентах для UIView"
date: 2018-01-25 20:56:01 +0200
description: Как установить относительные размеры для UIView
categories: ios
comments: true
image: /assets/images/ios/relative-height-3.png
tags: blog
---

В веб есть прекрасная идея: относительные единицы измерения - проценты, для дочернего элемента `width: 30%` значит "30% от ширины контейнера", а как сделать такое в iOS?

Задача в том, чтобы задать представлению (UIView) ограничение в 30% от высоты родительского представления.

В начальном состоянии имеем два представления: контейнер View и вложенное представление topView.

![начальное состояние проекта](/assets/images/ios/relative-height-1.png)

Выбираем `topView` в инспекторе представлений (панель в левой части storyboard) и с зажатым `Cmd` тянем мышкой к верхнему представлению `View`.

<div class="">
     <video class="video" src="/assets/images/ios/view1.mp4" controls></video>
</div>

При выбранном `topView`, в правой панеле находим ограничение `Equal height to: Superview`, двойным нажатием переходим к детальному редактированию.

Изменяем `Multiplier` с 1 на 1:3, таким образом устанавливаем относительную высоту `topView` к `SuperView` в пропорции 1 к 3.

<div class="">
     <video class="video" src="/assets/images/ios/view2.mp4" controls></video>
</div>

[Код на github](https://github.com/zhukovka/iosProject/tree/30percent)
