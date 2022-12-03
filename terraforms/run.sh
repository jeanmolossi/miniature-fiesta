#!/bin/bash
ACTION=$1

ENV_FILE="$PWD/.env.development.local"

if [ ! -f "$ENV_FILE" ]; then
	ENV_FILE="$PWD/.env.local"
fi

if [ ! -f "$ENV_FILE" ]; then
	ENV_FILE="$PWD/.env"
fi

if [ ! -f "$ENV_FILE" ]; then
	ENV_FILE="$PWD/.env.example"
fi

DB_USER=$(cat $ENV_FILE | sed '/^DB_USER=*/!d; s///;q')
DB_PASS=$(cat $ENV_FILE | sed '/^DB_PASSWORD=*/!d; s///;q')

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
			-var "rds_user={\"username\": \"$DB_USER\", \"password\": \"$DB_PASS\"}" \
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
			-var "rds_user={\"username\": \"$DB_USER\", \"password\": \"$DB_PASS\"}" \
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
			-var "rds_user={\"username\": \"$DB_USER\", \"password\": \"$DB_PASS\"}" \
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
