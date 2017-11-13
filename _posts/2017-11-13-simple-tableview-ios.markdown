---
layout: post
title:  "Делаем простую табличку для iOS"
subtitle: "Как сделать UITableView на swift"
date: 2017-11-13 22:16:06 +0200
description: Как сделать UITableView на swift
categories: ios
comments: true
image: /assets/images/ios/custom-view.png
tags: blog tableview
---

Давайте посмотрим на самую простую таблицу, чтобы иметь представление о том, как это работает. Предполагается, что у нас уже есть Single View Application в Xcode. Теперь давайте добавим Table View из библиотеки объектов.

![table view](/assets/images/ios/tableview.png)

Теперь надо добавить ограничения для представления.

![table view constaints](/assets/images/ios/tableview-constaints.png)

Следующий шаг - связать dataSource и delegate таблицы с ViewController.

![connect table view delegate](/assets/images/ios/connect-delegate.png)

Теперь мы готовы переместиться в код файла **ViewController.swift**. Здесь надо добавить протокол `UITableViewDataSource`, которому будет соответствовать наш ViewController.
Xcode предложит определить обязательные методы для UITableViewDataSource. Соглашаемся.

![UITableViewDataSource](/assets/images/ios/UITableViewDataSource.png)

Наш код выглядит так:

{% highlight swift %}
class ViewController: UIViewController, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        <#code#>
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        <#code#>
    }


    override func viewDidLoad() {<#code#>}

    override func didReceiveMemoryWarning() {<#code#>}

}
{% endhighlight %}

Первый метод - это

```tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int```

используется для того, чтобы указать на количество рядков в таблице.
Мы определим массив строк в классе ViewController и сможем указать, что количество рядков в таблице должно совпадать с количеством строк в этом массиве.

{% highlight swift %}
class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    private let dwarves = [
        "Sleepy", "Sneezy", "Bashful", "Happy",
        "Doc", "Grumpy", "Dopey",
        "Thorin", "Dorin", "Nori", "Ori",
        "Balin", "Dwalin", "Fili", "Kili",
        "Oin", "Gloin", "Bifur", "Bofur",
        "Bombur"
    ]

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return dwarves.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        <#code#>
    }
    <#code#>
}
{% endhighlight %}

Второй метод

```tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell```

TableView вызывает его, когда ему надо отобразить один рядок.

Обратите внимание на второй параметр - `cellForRowAt indexPath: IndexPath`.  Это экземпляр класса NSIndexPath - структуры, которую использует TableView для того, чтобы хранить индекс рядка и секции.

Не все данные в таблицы помещаются на экране телефона, чтобы просматривать скрытые рядки мы скролим экран. По мере того, как ячейка таблицы уходит за видимую часть экрана, она помещается в очередь ячеек доступных для переиспользования. В то время как одна ячейка может исчезнуть из видимости, другая может там появиться. Эта ячейка может переиспользовать тот объект представления, который остался от уже невидимой ячейки. Таким образом, система избегает перегрузки оперативной памяти. Для того, чтобы воспользоваться этим механизмом, нам надо присвоить ячейке идентификатор и выгружать соответствующий view из доступных для переиспользования.

В классе ViewController мы определим константу
```let simpleTableIdentifier = "SimpleTableIdentifier"```,
а в методе

```tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell```
попросим освободить доступный объект по идентификатору.

```var cell = tableView.dequeueReusableCell(withIdentifier: simpleTableIdentifier)```

Однако, для первого отображения очередь ячеек еще пуста, потому значение этой переменной будет `nil`. В таком случае мы создадим новую ячейку с идентификатором simpleTableIdentifier:

```
if (cell == nil) {
    cell = UITableViewCell(
        style: UITableViewCellStyle.default,
        reuseIdentifier: simpleTableIdentifier)
}
```

Теперь, чтобы передать нужное значение в каждую ячейку мы можем воспользоваться параметром `indexPath` и его свойством для индекса рядка. То есть, мы используем индекс текущего рядка, чтобы взять соответствующий элемент из массива:

```
cell?.textLabel?.text = dwarves[indexPath.row]
```

Наш конечный код:

{% highlight swift %}
import UIKit

class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    private let dwarves = [
        "Sleepy", "Sneezy", "Bashful", "Happy",
        "Doc", "Grumpy", "Dopey",
        "Thorin", "Dorin", "Nori", "Ori",
        "Balin", "Dwalin", "Fili", "Kili",
        "Oin", "Gloin", "Bifur", "Bofur",
        "Bombur"
    ]
    let simpleTableIdentifier = "SimpleTableIdentifier"

    // MARK:-
    // MARK: Table View Data Source Methods
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return dwarves.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        var cell = tableView.dequeueReusableCell(withIdentifier: simpleTableIdentifier)
        if (cell == nil) {
            cell = UITableViewCell(
                style: UITableViewCellStyle.default,
                reuseIdentifier: simpleTableIdentifier)
        }

        cell?.textLabel?.text = dwarves[indexPath.row]
        return cell!
    }


    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

}
{% endhighlight %}

[Код на github](https://github.com/zhukovka/iosProject/tree/simple-tableview)

---
**Beginning iPhone Development with Swift 3: Exploring the iOS SDK, Third Edition**
by Jeff Lamarche, Fredrik Olsson, David Mark, Kim Topley, Molly Maskrey
Publisher: Apress
Release Date: April 2017
ISBN: 9781484222232