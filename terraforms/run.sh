#!/bin/bash
ACTION=$1

cmdPath="$PWD/terraforms"
configPath="configs"
baseVarFile="base.tfvars"
varFile="vars.tfvars"
services="s3"

echo "Running terraform $ACTION"

backendConfig="$cmdPath/$configPath/$baseVarFile"
baseVarsFile="$cmdPath/$configPath/$baseVarFile"
appVarsFile="$cmdPath/$configPath/$varFile"

function init {
    for service in $services; do
        if [ ! -d "$cmdPath/$service/.terraform" ]; then
            echo "Initializing $service"
            cd "$cmdPath/$service"
            terraform init -backend-config="$backendConfig" -reconfigure
            cd ../../
        fi
    done
}

function plan {
    for service in $services; do
        echo "planning $service"
        cd "$cmdPath/$service"
        terraform plan \
            -var-file="$baseVarsFile" \
            -var-file="$appVarsFile" \
            -out="$service.plan"
        cd ../../
    done
}

function apply {
    for service in $services; do
        echo "applying $service"
        cd "$cmdPath/$service"
        terraform apply \
            -var-file="$baseVarsFile" \
            -var-file="$appVarsFile" \
            -auto-approve
        cd ../../
    done
}

function destroy {
    invertedServices=$(echo $services | sed 's/ /\n/g' | tac | sed 's/\n/ /g')
    echo $invertedServices
    for service in $invertedServices; do
        echo "destroying $service"
        cd "$cmdPath/$service"
        terraform destroy \
            -var-file="$baseVarsFile" \
            -var-file="$appVarsFile" \
            -auto-approve
        cd ../../
    done
}

function clearOut {
    for service in $services; do
        printf "\n"
        echo "clearing out from $service"
        cd "$cmdPath/$service"
        if [ -f "$service.plan" ]; then
            rm "$service.plan"
        fi
        cd ../../
    done
}

if [[ $ACTION == "init" ]]; then
    init
    exit 0
fi

if [[ $ACTION == "plan" ]]; then
    plan
    exit 0
fi

if [[ $ACTION == "apply" ]]; then
    apply
    clearOut
    exit 0
fi

if [[ $ACTION == "destroy" ]]; then
    destroy
    clearOut
    exit 0
fi

echo "Usage: ./run.sh <init|plan|apply|destroy>"
