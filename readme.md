# 前言

快速部署阿里云 FNF（Serverless Workflow） 项目

## 快速入门

Serverless Devs FNF组件支持Yaml描述和纯命令行方式对FNF进行操作。

首先在当前项目下，创建一个测试的FNF Yaml（`flow.yaml`）：

```yaml
version: v1beta1
type: flow
steps:
  - type: pass
    name: helloworld
```

### 纯命令行进行操作

通过执行`s cli fnf deploy -r ch-shanghai --name mytest --definition ./flow.yaml`即可进行快速的部署：

部署之后，可以看到返回结果：

```yaml
RegionId: ch-shanghai
Name: mytest
```

### Yaml进行部分内容描述

可以通过Yaml（`s.yaml`）对一下参数进行描述：

```yaml
edition: 3.0.0    #  命令行YAML规范版本，遵循语义化版本（Semantic Versioning）规范
name: test-fnf    #  项目名称
access: default   #  秘钥别名

resources:
  fnf-test: #  资源虚拟定位符
    component: fnf
    props:
      region: cn-qingdao
      name: test-xl2
      definition: ./flow.yaml
      description: Description
```

完成之后，只需要直接执行`s deploy`即可实现同样的部署效果

如果需要通过Yaml进行部分参数描述，可以参考以下参数内容：

| 参数名 |  必填  |  类型  |  参数描述  |
| --- |  ---  |  ---  |  ---  |
| region | True | Enum | 地域 |
| name | True | String | Workflow 名字 |
| description | True | String | Workflow 描述 |
| type | True | Enum | 创建流程的类型，取值：FDL。 |
| definition | True | String | Definition 本地路径 |
| roleArn | False | String | 可选参数，流程执行所需的资源描述符信息，用于在任务执行时 FnF 进行 assume role。 |

## 命令使用

通过`s cli fnf -h`可以进行帮助信息查看, 也可以通过增加具体的指令查看更详细的帮助信息, 比如 `s cli fnf info -h`