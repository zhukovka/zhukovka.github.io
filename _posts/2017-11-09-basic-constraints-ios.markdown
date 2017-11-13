---
layout: post
title:  "Основы ограничений для представления в iOS"
subtitle: "Что надо знать о constraints для UIView на swift"
date: 2017-11-09 18:36:26 +0200
description: Как задать constraints для UIView на swift
categories: ios
comments: true
image: /assets/images/ios/custom-view.png
tags: blog
---

Когда интерфейс создается напрямую (не через инструмент для создания интерфейса interface builder), представлениям должен быть задан размер. Самый простой способ сделать это - использовать autolayout который требует чтобы были добавлены ограничения для представлений (constraints).

Свойства двух объектов связаны уравнением или неравенством следующей формы:

`object.property = otherObject.property * multiplier + constant`

В этом принципе зависимости свойств представлений друг от друга и есть основная суть ограничений (constraints) для представлений в интерфейсе iOS.

Ограничения (constraints) могут быть добавлены или изменены в методе `updateConstraints`. Этот метод вызывается автоматически после вызова метода `setNeedsUpdateConstraints`, который можно вызывать самостоятельно в каждом случае, когда изменяется свойство, которое влияет на внешний вид вашего компонента.

В этом процессе важно помнить, что autolayout захочет транслировать маски автоизменения размера (autoresizing masks) в ограничения (constraints) и вы можете не увидеть желаемого результата, для того чтобы это предотвратить каждое представление может задать значение `translatesAutoresizingMaskIntoConstraints = false`


{% highlight swift %}

{% endhighlight %}

[Код на github](https://github.com/zhukovka/iosplaygrounds/tree/create-view)

---
**Swift Essentials - Second Edition** by Dr. Alex Blewitt

Publisher: Packt Publishing
Release Date: January 2016
ISBN: 9781785888878