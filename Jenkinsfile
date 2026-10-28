pipeline {
  agent any

  stages {
    stage('Test echo') {
      steps {
        echo 'Hello, Jenkins!'
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