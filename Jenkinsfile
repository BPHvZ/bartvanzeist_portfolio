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
        nodejs('NodeJS 18.7.0') {
          sh '''corepack enable
yarn install'''
        }

      }
    }

    stage('Build') {
      steps {
        nodejs('NodeJS 18.7.0') {
          sh 'yarn run build'
        }

      }
    }

    stage('Deploy main') {
      when {
        branch 'main'
      }
      steps {
        ftpPublisher alwaysPublishFromMaster: false, continueOnError: false, failOnError: false, paramPublish: [parameterName: ''], masterNodeName: 'master', publishers: [[configName: 'bartvanzeist.nl', transfers: [[asciiMode: false, cleanRemote: true, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '', remoteDirectorySDF: false, removePrefix: 'bartvanzeist/public', sourceFiles: 'bartvanzeist/public/**']], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false]]
      }
    }

  }
}
