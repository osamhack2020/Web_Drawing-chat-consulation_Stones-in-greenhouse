---
description: 프로젝트 개발을 위한 기능적 의사결정 사항입니다.
---

# 기능적 의사결정

### _채팅 방식_ 

{% hint style="success" %}
Web socket
{% endhint %}

우선적으로 개발하는 것이 Web이기에 Web socket을 이용해 구성원들끼리 상담을 합니다.

### _데이터 관리_ 

{% hint style="success" %}
Nosql vs RDBMS
{% endhint %}

Django에 Nosql이 있긴하다. 하지만 관련 개발 문서도 적은데다가 Django자체에서 RDBMS를 지원해주기 때문에 개발의 효율성을 높히고자 RDBMS를 선택하였습니다.

### _구성원 인증 방식_

{% hint style="success" %}
Google Smtp
{% endhint %}

Google의 G-mail을 통해 회원가입 인증을 한다.  또한 군부대 내의 인터넷망\(국방망\)에서 서비스를 이용한다면 Smtp를 따로 구현하여 육군 웹메일을 통해 인증하면 될 것입니다.

