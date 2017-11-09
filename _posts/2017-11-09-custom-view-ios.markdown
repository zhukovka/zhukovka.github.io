---
layout: post
title:  "Custom view iOS"
subtitle: "Создаем custom view на swift"
date: 2017-11-09 17:47:27 +0200
description: Как сделать iOS custom view на swift
categories: ios
comments: true
image: /assets/images/ios/custom-view.png
tags: blog
---

Свой `View` можно сделать как подкласс `UIView`. Такой подкласс `UIView` должен иметь два инициализатора: один принимает в аргумент `frame:CGRect`, а второй `coder:NSCoder`. Тот который принимает `frame` обычно используется в коде и определяется с помощью `rect` (x,y,width,height). `coder` используется тогда когда сериализуется из файла `xib`.

Часто используется метод типа `setupView` который можно вызвать из обоих инициализаторов. Поскольку не существует единообразного названия такого метода часто в примерах можно увидеть еще один метод инициализации `init`.

{% highlight swift %}
class OfflineMessageView: UIView {
    required init?(coder:NSCoder) {
        super.init(coder:coder)
        setupView()
    }
    override init(frame:CGRect) {
        super.init(frame:frame)
        setupView()
    }
    func setupView() {
        //add subviews here
    }
}
{% endhighlight %}

[Код на github](https://github.com/zhukovka/iosplaygrounds/tree/create-view)

---
**Swift Essentials - Second Edition** by Dr. Alex Blewitt

Publisher: Packt Publishing
Release Date: January 2016
ISBN: 9781785888878