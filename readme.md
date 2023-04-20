# 前言

快速部署阿里云 FNF（Serverless Workflow） 项目


# 快速入门

Serverless Devs FNF组件支持Yaml描述和纯命令行方式对FNF进行操作。

首先在当前项目下，创建一个测试的FNF Yaml（`flow.yaml`）：

```
version: v1beta1
type: flow
steps:
  - type: pass
    name: helloworld

```

## 纯命令行进行操作

通过执行`s cli fnf deploy -r ch-shanghai -n mytest -d ./flow.yaml`即可进行快速的部署：

部署之后，可以看到返回结果：

```
RegionId: ch-shanghai
Name: mytest
```

## Yaml进行部分内容描述

可以通过Yaml（`s.yaml`）对一下参数进行描述：

```
edition: 1.0.0          #  命令行YAML规范版本，遵循语义化版本（Semantic Versioning）规范
name: fnfApp            #  项目名称
access: aliyun-release  #  秘钥别名

services:
  fnf-test: #  服务名称
    component:  fnf
    props:
      region: cn-hangzhou
      name: test
      description: Description
      definition: ./flow.yaml
```

完成之后，只需要直接执行`s deploy`即可实现同样的部署效果

如果需要通过Yaml进行部分参数描述，可以参考以下参数内容：

| 参数名 |  必填  |  类型  |  参数描述  |
| --- |  ---  |  ---  |  ---  |
| region | True | Enum | 地域 |
| name | True | String | Workflow 名字 |
| description | True | String | Workflow 描述 |
| type | True | Enum | 创建流程的类型，取值：FDL。 |
| definition | True | String | Definition 本地路径或者配置信息 |
| roleArn | False | String | 可选参数，流程执行所需的资源描述符信息，用于在任务执行时 FnF 进行 assume role。 |

# 命令使用

通过`s cli fnf -h`可以进行帮助信息查看：
```
  fnf@0.0.4: 快速部署阿里云 FNF（Serverless Workflow） 项目

    deploy    :  创建FNF
    remove    :  删除FNF
    schedule  :  定时调度相关操作
    execution :  流程相关操作

  🧭 More information: https://www.aliyun.com
```

包括了：
- deploy    :  创建FNF
- remove    :  删除FNF
- schedule  :  定时调度相关操作
- execution :  流程相关操作

## Deploy

部署/创建一个FNF：

```
Deploy

  Deploy fnf resources 

Options

  -r, --region string    [Optional] Stack region. Defaults to cn-hangzhou                 
  -n, --name string      [Optional] Stack name.                                           
  --definition string    [Optional] Template path.                                        
  --description string   [Optional] Stack description.                                    
  --type string          [Optional] The type of the creation process. Defaults to is FDL. 

Global Options

  --debug string          [Optional] Output debug informations   
  -h, --help              [Optional] Help for command            
  -t, --template string   [Optional] Specify the template file   
  -a, --access string     [Optional] Specify key alias           

Examples with Yaml

  $ s deploy 
```

如果是通过`s.yaml`进行使用：`s deploy`   
如果通过纯命令行：`s cli fnf deploy`

## Remove

移除一个FNF：

```
Remove

  Remove fnf resources 

Options

  -r, --region string   [Optional] Stack region. Defaults to cn-hangzhou 
  -n, --name string     [Optional] Stack name.                           

Global Options

  --debug string          [Optional] Output debug informations   
  -h, --help              [Optional] Help for command            
  -t, --template string   [Optional] Specify the template file   
  -a, --access string     [Optional] Specify key alias           

Examples with Yaml

  $ s remove 
```

如果是通过`s.yaml`进行使用：`s remove`   
如果通过纯命令行：`s cli fnf remove`

## List

查看Flow列表

```
List

  Show fnf resources 

Options

  -r, --region string   [Optional] Stack region. Defaults to cn-hangzhou 

Global Options

  --debug string          [Optional] Output debug informations   
  -h, --help              [Optional] Help for command            
  -t, --template string   [Optional] Specify the template file   
  -a, --access string     [Optional] Specify key alias           

Examples with Yaml

  $ s list 
```

使用方法：

```
s cli fnf list -r cn-hangzhou
```

运行结果：

```
List workflow ... 
- Name: mytest
  Description: Create By Serverless Devs
  Definition: |
    version: v1beta1
    type: flow
    steps:
      - type: pass
        name: helloworld
  Id: 9848633b-43d5-4201-a4ef-f4b69752107b
  Type: FDL
  RoleArn: ''
  CreatedTime: '2021-06-21T06:18:02.498Z'
  LastModifiedTime: '2021-06-21T06:18:02.498Z'
```


## Execution

流程相关操作，支持的方法：
      
```
list      Get all historical execution under a process.          
get       Get the status of one execution and other information. 
start     Start a process execution.                             
stop      Stop a process executione.                             
history   Get the details of each step in the execution process.    
```

例如：

- 开始一个工作流

    ```
    s cli fnf execution start -n mytest
    ```
    
    运行结果：
    
    ```
    RegionId: cn-hangzhou
    FlowName: mytest
    StartedTime: '2021-06-21T07:15:37.073Z'
    ExecutionName: 4930cafc-d921-4c71-97f4-b33933484a7d
    ```

- 获取一个工作流运行

    ```
    s cli fnf execution get execution get -e f951aa9c-e3d3-44f6-b895-b0c925756186 -n mytest -r cn-hangzhou
    ```
    
    运行结果：
    
    ```
    RegionId: cn-hangzhou
    FlowName: mytest
    StartedTime: '2021-06-21T07:17:13.22Z'
    StoppedTime: '2021-06-21T07:17:13.283Z'
    Status: Succeeded
    ExecutionName: f951aa9c-e3d3-44f6-b895-b0c925756186
    Output: '{}'
    ```
    
## Schedule

定时调度相关操作，支持的方法：

```
deploy   Add or update schedule; help command [s schedule deploy -h] 
remove   Remove schedule; help command [s schedule remove -h]        
get      Get schedule config; help command [s schedule get -h]       
list     List schedule; help command [s schedule list -h]   
```


> 更多帮助信息，可以直接通过`-h`获取，例如`s cli fnf schedule add -h`
