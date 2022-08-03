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
        script {
          withCredentials([usernamePassword(credentialsId: 'strato_sftp', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            def remote = [:]
            remote.name = "ssh.strato.de"
            remote.host = "ssh.strato.de"
            remote.allowAnyHosts = true
            remote.user = USERNAME
            remote.password = PASSWORD
            sshCommand remote: remote, command: 'cd bartvanzeist && rm -rf *'
            sshPut remote: remote, from: 'public', into: 'bartvanzeist'
            sshCommand remote: remote, command: 'cp -R bartvanzeist/public/. bartvanzeist && rm -rf bartvanzeist/public'
          }
        }

      }
    }

  }
}
