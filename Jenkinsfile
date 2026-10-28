pipeline {
  agent any

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
          reuseNode true
        }
      }

      steps {
        echo '[Build] Starting Frontend Build inside Docker Container.'

        // sh は独立したシェルで実行されるらしい
        // ディレクトリを指定したい場合は、cdではなく以下のように指定する
        // cdを使いたい場合は、ワンライナー(一つのsh内)で書くべきらしい
        dir ('front') {
          sh '''
            set -eu

            echo "=== Execution identity ==="
            id

            echo "=== Original environment ==="
            echo "HOME=${HOME:-<unset>}"
            npm config get cache

            # ホームとnpmキャッシュをワークスペース配下に統一
            export HOME="$WORKSPACE/.home"
            export NPM_CONFIG_CACHE="$WORKSPACE/.npm-cache"

            mkdir -p "$HOME" "$NPM_CONFIG_CACHE"

            echo "=== Effective npm cache ==="
            npm config get cache

            npm ci
            npm run build
          '''
        }
        
        // Viteの成果物は front/dist/ にある
        archiveArtifacts artifacts: 'front/dist/**', fingerprint: true
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

        sh '''
          set -eu

          : "${TARGET_DIR:?TARGET_DIR is not set}"
          test -d front/dist

          mkdir -p "$TARGET_DIR"

          # 配置先の既存ファイルを削除
          find "$TARGET_DIR" \
              -mindepth 1 -maxdepth 1 \
              -exec rm -rf -- {} +

          # distの内容を配置。ドットファイルもコピーする
          cp -a front/dist/. "$TARGET_DIR"/
        '''

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