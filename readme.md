# 前言

快速部署阿里云 FNF（Serverless Workflow） 项目

# 测试

template.yaml

```
edition: 1.0.0          #  命令行YAML规范版本，遵循语义化版本（Semantic Versioning）规范
name: fnfApp            #  项目名称
access: aliyun-release  #  秘钥别名

services:
  fnf-test: #  服务名称
    component:  ros
    props:
      region: cn-hangzhou
      name: test
      description: Description
      definition: ./flow.yaml
```

flow.yaml

```
version: v1beta1
type: flow
steps:
  - type: pass
    name: helloworld

```

# 完整配置

```
edition: 1.0.0          #  命令行YAML规范版本，遵循语义化版本（Semantic Versioning）规范
name: fnfApp            #  项目名称
access: aliyun-release  #  秘钥别名

services:
  fnf-test: #  服务名称
    component:  ros
    props:
        region: cn-hangzhou
        name: test
        definition: ./temp.json
        description: by serverless devs
        type: FDL
        roleArn: acs:ram:${region}:${accountID}:${role}
```

# 参数详情

| 参数名 |  必填  |  类型  |  参数描述  |
| --- |  ---  |  ---  |  ---  |
| region | True | Enum | 地域 |
| name | True | String | Workflow 名字 |
| description | True | String | Workflow 描述 |
| type | True | Enum | 创建流程的类型，取值：FDL。 |
| definition | True | String | Definition 本地路径 |
| roleArn | False | String | 可选参数，流程执行所需的资源描述符信息，用于在任务执行时 FnF 进行 assume role。 |

