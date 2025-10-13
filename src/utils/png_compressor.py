import os
import tempfile
from PIL import Image


def compress_png(image_path, quality=85):
    """
    压缩PNG图片并替换原文件
    
    参数:
        image_path: 图片文件路径
        quality: 压缩质量，范围0-100，数值越高质量越好
    """
    try:
        # 打开图片
        with Image.open(image_path) as img:
            # 如果图片不是RGBA模式，转换为RGBA以保持透明度
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            # 创建临时文件
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
                temp_filename = temp_file.name
            
            # 保存压缩后的图片到临时文件
            img.save(temp_filename, 'PNG', optimize=True, quality=quality)
            
            # 检查临时文件是否有效且小于原文件
            if os.path.getsize(temp_filename) < os.path.getsize(image_path):
                # 删除原文件
                os.remove(image_path)
                # 将临时文件移动到原文件位置
                os.rename(temp_filename, image_path)
                print(f"压缩成功: {image_path}")
            else:
                # 如果压缩后文件更大，则不替换
                os.remove(temp_filename)
                print(f"未压缩 (压缩后更大): {image_path}")
                
    except Exception as e:
        print(f"处理失败 {image_path}: {str(e)}")
        # 确保临时文件被清理
        if 'temp_filename' in locals() and os.path.exists(temp_filename):
            os.remove(temp_filename)


def process_directory(directory, quality=85):
    """
    递归处理目录中的所有PNG图片
    
    参数:
        directory: 要处理的目录路径
        quality: 压缩质量
    """
    for root, dirs, files in os.walk(directory):
        for file in files:
            # 检查文件是否为PNG
            if file.lower().endswith('.png'):
                file_path = os.path.join(root, file)
                compress_png(file_path, quality)


if __name__ == "__main__":
    import sys
    
    # 获取要处理的目录，默认为当前目录
    target_directory = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    
    # 验证目录是否存在
    if not os.path.isdir(target_directory):
        print(f"错误: {target_directory} 不是有效的目录")
        sys.exit(1)
    
    # 设置压缩质量（0-100）
    compression_quality = 85
    
    print(f"开始处理目录: {target_directory}")
    print(f"压缩质量: {compression_quality}")
    process_directory(target_directory, compression_quality)
    print("处理完成")
    