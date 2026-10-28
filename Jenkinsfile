pipeline {
  agent none

  stages {
    stage('Checkout') {
      agent any
      steps {
        checkout scm
      }
    }

    stage('[Build](inside Container) - Frontend') {
      agent {
        docker {
          image 'mcr.microsoft.com/devcontainers/typescript-node:1-22-bullseye'
        }
      }

      steps {
        echo '[Build] Starting Frontend Build inside Docker Container.'

        // sh は独立したシェルで実行されるらしい
        // ディレクトリを指定したい場合は、cdではなく以下のように指定する
        // cdを使いたい場合は、ワンライナー(一つのsh内)で書くべきらしい
        dir ('front') {
          // 依存関係のインストールとビルド
          sh 'npm ci'
          sh 'npm run build'
        }
        

        echo '[Build] Frontend Build completed successfully.'
      }
    }

    stage('[Deploy] - Frontend') {
      agent any
      // steps {
      //   // Viteのビルド成果物をJenkinsにアーカイブ(どこのディレクトリにあんねん)
      //   archiveArtifacts artifacts: 'dist/**', fingerpring:true
      // }
      environment {
        // ビルド成果物の置き換え先
        TARGET_DIR = '/home/ubuntu/md-shelf-service/static'
      }
      steps {
        echo '[Deploy] Starting Frontend Deployment.'

        // 対象ディレクトリが無い場合は作成する
        sh 'mkdir -p ${TARGET_DIR}'

        // ディレクトリ内の古いファイルを削除
        sh 'rm -rf ${TARGET_DIR}/*'

        // ビルド成果物を対象ディレクトリにコピー
        sh 'cp -r dist/* ${TARGET_DIR}/'

        echo '[Deploy] Frontend Deployment completed successfully.'
      }
    }
  }

  // ビルド終了後の処理（成功・失敗・常時など）
  post {
    always {
      echo 'Pipeline finished.'
    }
    success {
      echo 'Build Succeeded!'
    }
    failure {
      echo 'Build Failed!'
    }
  }
}