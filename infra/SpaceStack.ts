import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Code, Function as LambdaFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { GenericTable } from '../GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class SpaceStack extends Stack {

    private api = new RestApi(this, 'SpaceApi');

    //private spaceTable = new GenericTable('spaceTable', 'spaceId', this);

    constructor(scope: Construct, id:string, props:StackProps) {
        super(scope, id, props)

        const helloLambda =  new LambdaFunction(this, 'helloLambda', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromAsset(join(__dirname, '..', 'service', 'hello')),
            handler: 'hello.main'
        });

        new GenericTable('spaceTable', 'spaceId', this)

        new NodejsFunction(this, 'hLambdaNodejs', {
            entry: (join(__dirname, '..', 'services', 'node-lambda', 'hello.ts')),
            handler: 'handler'
        });

        // Hello Api lambda integration
        const helloLambdaIntegration = new LambdaIntegration(helloLambda)
        const helloLambdaResource = this.api.root.addResource('hello')
        helloLambdaResource.addMethod('GET', helloLambdaIntegration)

    }

}