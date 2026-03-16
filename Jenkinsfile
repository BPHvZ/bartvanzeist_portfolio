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
        sshPublisher alwaysPublishFromMaster: false, continueOnError: false, failOnError: true, publishers: [[configName: 'bartvanzeist.nl', transfers: [[cleanRemote: true, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '.deploy-bartvanzeist/release', remoteDirectorySDF: false, removePrefix: 'public', sourceFiles: 'public/**'], [execCommand: '''set -e
rm -rf 'httpdocs.previous'
if [ -d 'httpdocs' ]; then
  mv 'httpdocs' 'httpdocs.previous'
fi
if mv '.deploy-bartvanzeist/release' 'httpdocs'; then
  rm -rf '.deploy-bartvanzeist' 'httpdocs.previous'
else
  if [ -d 'httpdocs.previous' ]; then
    mv 'httpdocs.previous' 'httpdocs'
  fi
  exit 1
fi''', execTimeout: 120000, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '.', remoteDirectorySDF: false, removePrefix: '', sourceFiles: '']], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false]]
      }
    }

  }
}
