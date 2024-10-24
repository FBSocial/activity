import { abbreviatedSha, branch, committerDate, sha } from '~build/git'
import now from '~build/time'

/**
 * 输出语义化的 Git 信息到控制台
 *
 * 该函数在开发环境下，以美化的格式输出 Git 相关信息和其他有用的调试信息
 */
export function logSemanticGitInfo(): void {
  const gitInfo: Record<string, string> = {
    '分支': branch,
    'SHA': sha,
    '简化 SHA': abbreviatedSha,
    '提交日期': committerDate,
    '构建时间': now.toISOString(),
    '代码环境': import.meta.env.MODE,
  }

  if (import.meta.env.MODE !== 'development') {
    console.log('%c🔍 项目调试信息 🔍', 'color: #4a90e2; font-size: 18px; font-weight: bold;')

    const maxKeyLength = Math.max(...Object.keys(gitInfo).map(key => key.length))
    const maxValueLength = Math.max(...Object.values(gitInfo).map(value => value.length))
    const totalLength = maxKeyLength + maxValueLength + 7 // 7 是额外的分隔符和空格的长度

    console.log('%c' + '─'.repeat(totalLength), 'color: #4a90e2;')

    for (const [key, value] of Object.entries(gitInfo)) {
      console.log(
        `%c│ %c${key.padEnd(maxKeyLength)} %c│ %c${value.padEnd(maxValueLength)} %c│`,
        'color: #4a90e2;',
        'color: #f39c12; font-weight: bold;',
        'color: #4a90e2;',
        'color: #2ecc71;',
        'color: #4a90e2;'
      )
    }

    console.log('%c' + '─'.repeat(totalLength), 'color: #4a90e2;')
    console.log('%c如有问题，请提供以上信息给开发团队', 'color: #e74c3c; font-style: italic;')
  }
}
