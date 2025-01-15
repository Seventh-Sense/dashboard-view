import subprocess
import re

def get_commit_messages(since_tag, until_tag):
    """
    获取两个标签之间的提交信息。

    :param since_tag: 起始标签（不包含）
    :param until_tag: 结束标签（包含）
    :return: 提交信息的列表
    """
    # 使用 git log 命令获取提交信息
    result = subprocess.run(
        ['git', 'log', f'{since_tag}..{until_tag}', '--oneline', '--decorate', '--no-merges', '--pretty=format:%s'],
        capture_output=True,
        text=True
    )
    
    #print(result.stdout.splitlines())
    # 解析输出
    commit_messages = []
    for line in result.stdout.splitlines():
        commit_hash, commit_message = line.split(None, 1)  # 分割提交哈希和提交信息
        #print(line.split(None, 1))
        commit_messages.append(commit_message.strip())
    
    return commit_messages

def get_test_messages():
    """
    获取两个标签之间的提交信息。

    :param since_tag: 起始标签（不包含）
    :param until_tag: 结束标签（包含）
    :return: 提交信息的列表
    """
    # 使用 git log 命令获取提交信息
    result = subprocess.run(
        ['git', 'log', '--oneline', '--decorate', '--no-merges', '--pretty=format:%s'],
        capture_output=True,
        text=True
    )
    
    print(result.stdout.splitlines())
    # 解析输出
    commit_messages = "Release Notes:\n\n"
    for line in result.stdout.splitlines():
        commit_hash, commit_message = line.split(None, 1)  # 分割提交哈希和提交信息
        #print(line.split(None, 1))
        commit_messages += commit_message.strip()
    
    return commit_messages

def format_release_notes(commit_messages):
    """
    格式化提交信息为发布说明。

    :param commit_messages: 提交信息的列表
    :return: 格式化后的发布说明字符串
    """
    release_notes = "Release Notes:\n\n"
    #print(commit_messages)
    for index, commit_message in enumerate(commit_messages):
        # 可以在这里添加更多的格式化逻辑，比如根据提交信息中的关键字分类
        release_notes += f"{index + 1}: {commit_message}\n"
    
    return release_notes

def get_latest_two_tags():
    result = subprocess.run(
        ['git', 'tag'],
        capture_output=True,
        text=True
    )

    last_two_elements = result.stdout.splitlines()[len(result.stdout.splitlines())-2:len(result.stdout.splitlines())]
    #print(last_two_elements)
    return last_two_elements

def main():
    # 假设你通过某种方式获取了上一个发布标签和当前发布标签
    # 这里为了示例，我们手动指定
    #last_two_elements = get_latest_two_tags()
    
    # 获取提交信息
    #commit_messages = get_commit_messages(last_two_elements[0], last_two_elements[1])
    
    # 生成发布说明
    #release_notes = format_release_notes(commit_messages)
    
    # 将发布说明输出到文件或打印到控制台（这里打印到控制台）
    #print(release_notes)
    
    release_notes = get_test_messages()
    # 如果需要将发布说明写入文件，可以使用以下代码
    with open("release_notes.md", "w") as file:
      file.write(release_notes)

if __name__ == "__main__":
    main()
