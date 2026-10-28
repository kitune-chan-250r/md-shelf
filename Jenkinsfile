pipeline {
  agent any

  stages {
    stage('') {

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