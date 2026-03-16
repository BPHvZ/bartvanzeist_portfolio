pipeline {
  triggers {
    pollSCM 'H/5 * * * *'
  }
  options {
    disableConcurrentBuilds abortPrevious: true
  }
  agent any
  stages {
    stage('Prepare') {
      steps {
        nodejs('NodeJS 24.14.0') {
          sh '''corepack enable
yarn install --immutable'''
        }

      }
    }

    stage('Setup .NET SDK') {
      steps {
        sh '''set -e
DOTNET_DIR="$WORKSPACE/.dotnet"
INSTALL_SCRIPT="$WORKSPACE/.dotnet-install.sh"

mkdir -p "$DOTNET_DIR"

if [ ! -x "$DOTNET_DIR/dotnet" ]; then
  curl -fsSL https://dot.net/v1/dotnet-install.sh -o "$INSTALL_SCRIPT"
  bash "$INSTALL_SCRIPT" --channel 8.0 --install-dir "$DOTNET_DIR"
fi'''
      }
    }

    stage('Build') {
      steps {
        nodejs('NodeJS 24.14.0') {
          sh '''export PATH="$WORKSPACE/.dotnet:$PATH"
yarn run build'''
        }

      }
    }

    stage('Deploy main') {
      when {
        branch 'main'
      }
      steps {
        ftpPublisher alwaysPublishFromMaster: false, continueOnError: false, failOnError: false, paramPublish: [parameterName: ''], masterNodeName: 'master', publishers: [[configName: 'bartvanzeist.nl', transfers: [[asciiMode: false, cleanRemote: true, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: 'httpdocs', remoteDirectorySDF: false, removePrefix: 'public', sourceFiles: 'public/']], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false]]
      }
    }

  }
}
