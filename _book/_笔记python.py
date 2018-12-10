python
    1、基本类型
        string 字符串
            反斜杠可以用来转义，使用r可以不发生转义。   r"\n"
            按字面意义级联字符串。   "this " "is " 会被自动转换为this is
            用 * 运算符重复。   "a"*3
            切片  字符串[头下标:尾下标]
            print( x, end=";",sep=',')不换行
            from sys import argv,path
            a = b = c = 1
            a, b, c = 1, 2, "runoob"
            string字符不可改变
        Number 数字
            支持 int、float、bool、complex（复数）。
            2 // 4 # 除法，得到一个整数0
            2 ** 5 # 乘方 32
            del 删除
        List 数组
            [:]就是[0:-1]
            +链接数组，*重复数组
            元素可以改变
            二维数组[[0 for i in range(3)] for i in range(5)]
            [表达式 for 变量 in 列表 if 条件]
        Tuple 元组
            tuple(seq)
            (),与数组不同是不能修改
            空元祖()  一个元素(20,)
            ="a","b","c" 不用空格也可以
            tuple(seq) 将列表转换为元组
            没有增删改
            指向不变，元祖的数组还是可以变参数
            字符串是一种特殊的tuple
            collections.namedtuple元祖
        Set 集合
            set('abcab')={'a','b','c','a','b'}=={'a','b','c'}
            'a' in student
            (a - b)     # a和b的差集
            (a | b)     # a和b的并集
            (a & b)     # a和b的交集
            (a ^ b)     # a和b中不同时存在的元素
        Dictionary 字典
            用字典里没有的键访问数据，会输出错误
            调换：reverse = {v: k for k, v in dic.items()}
            dic = {} dic[1] = 'one' dic['one'] = 1
            key唯一
            dic.keys() .values() .clear()
            {x: x**2 for x in (2, 4, 6)}  {2: 4, 4: 16, 6: 36}
            dict() 可以直接从键值对序列中构建字典
            dict([('a', 1), ('b', 2)])=dict(a=1, b=2)=dict(zip(['a', 'b'], [1, 2]))
                    =={'a': 1, 'b': 2}
            通过value获取key list(dic.keys())[list(dic.values()).index(value)]

    2、运算
        序列：索引，切片，加，乘，检查成员
        == 调用对象的 __eq__()
        // 取整除   ~ 按位取反
        and 前为 False 返回前，否则返回后值
        or 前为 True 返回前，否则返回后值
        not 取反，返回 False 或 True
        in 是否在序列中
        is 两个标识符是不是引用自一个对象，类似 id(x) == id(y)
            is 用于判断两个变量引用对象是否为同一个， == 用于判断引用变量的值是否相等。
        分数：fractions.Fraction
        for x,y in enumerate(seq) 循环
        迭代器：iter(list)  next(iter)
        生成器：yield #使用后函数返回为迭代器
        try:
        except :  #raise
        语句
            pass #如果没有内容，可以先写pass，但是如果不写pass，就会语法错误
            if – elif – else 条件为假：0, false, '', None
                if (name == "pag"):{
                  print(name == "pag") # True
                }
            while (flag): do
            while Flag:
                do
            else:
                do
            for x in seq:
                <statements>
                break #跳出不走else
            else:
                <statements>
            for i in range(len(a)):
                print(i, a[i])
        python 中一切都是对象，严格意义我们不能说值传递还是引用传递，我们应该说传不可变对象和传可变对象。

    3、函数
        内建参数
            ['ArithmeticError', 'AssertionError', 'AttributeError', 'BaseException', 'BlockingIOError', 'BrokenPipeError', 'BufferError', 'BytesWarning', 'ChildProcessError', 'ConnectionAbortedError', 'ConnectionError', 'ConnectionRefusedError', 'ConnectionResetError', 'DeprecationWarning', 'EOFError', 'Ellipsis', 'EnvironmentError', 'Exception', 'False', 'FileExistsError', 'FileNotFoundError', 'FloatingPointError', 'FutureWarning', 'GeneratorExit', 'IOError', 'ImportError', 'ImportWarning', 'IndentationError', 'IndexError', 'InterruptedError', 'IsADirectoryError', 'KeyError', 'KeyboardInterrupt', 'LookupError', 'MemoryError', 'ModuleNotFoundError', 'NameError', 'None', 'NotADirectoryError', 'NotImplemented', 'NotImplementedError', 'OSError', 'OverflowError', 'PendingDeprecationWarning', 'PermissionError', 'ProcessLookupError', 'RecursionError', 'ReferenceError', 'ResourceWarning', 'RuntimeError', 'RuntimeWarning', 'StopAsyncIteration', 'StopIteration', 'SyntaxError', 'SyntaxWarning', 'SystemError', 'SystemExit', 'TabError', 'TimeoutError', 'True', 'TypeError', 'UnboundLocalError', 'UnicodeDecodeError', 'UnicodeEncodeError', 'UnicodeError', 'UnicodeTranslateError', 'UnicodeWarning', 'UserWarning', 'ValueError', 'Warning', 'WindowsError', 'ZeroDivisionError', '__build_class__', '__debug__', '__doc__', '__import__', '__loader__', '__name__', '__package__', '__spec__', 'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'breakpoint', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 'compile', 'complex', 'copyright', 'credits', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'exit', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'license', 'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'quit', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip']
        def printinfo( name,age=35): # 默认参数放最后
        def fn( arg1, *vartuple ):  #后面参数元组
        def fn( arg1, **vartuple ):  #fn(10, a=70, b=60)
        def fn(a,b,*,c) #*后的为字典
        def.__doc__ 函数注释
        匿名函数
            lambda [arg1 [,arg2,.....argn]]:expression
            sum = lambda arg1, arg2: arg1 + arg2
        作用域
            L （Local） 局部作用域
            E （Enclosing） 闭包函数外的函数中
            G （Global） 全局作用域
            B （Built-in） 内建作用域 import builtins dir(builtins)

        #只有模块（module），类（class）以及函数（def、lambda）才会引入新的作用域，其它的代码块（如 if/elif/else/、try/except、for/while等）是不会引入新的作用域的，也就是说这些语句内定义的变量，外部也可以访问
        新作用域修改外部变量需要global和nonlocal
            global num 修改外部
            nonlocal nnum 修改上级
        装饰器
            def log(fn):#将被装饰函数传入
                def wrapper():
                    print("**********")
                    return fn()#执行被装饰的函数
                return wrapper#将装饰完之后的函数返回（返回的是函数名）
            @log
            def pr():
                print("我是小小洋")

    4、模块，类
        模块
            from modname
            from modname import *
            __name__ #'__main__'或模块名
            dir() #查看当前所有方法
            dir(modname) #查看模块所有方法
            __init__.py 存在一个叫做 __all__ 变量 代表*
        类
            类方法必须包含参数 self, 且为第一个参数，self 代表的是类的实例
            class ClassName:
                <statement-1>...
                <statement-N>
            class Complex:
                def __init__(self, a):
                    self.r=a
                    self.__class__
            x = Complex(3.0)
            继承
                class DerivedClassName(modname.BaseClassName):
                class student(people):people.
                class sample(speaker,student):多继承，方法名相同用前面的
            继承重写
                子类不重写 __init__，实例化子类时，会自动调用父类定义的 __init__
                class Parent:        # 定义父类
                   def myMethod(self):
                      print ('调用父类方法')
                class Child(Parent): # 定义子类
                   def myMethod(self):
                      print ('调用子类方法')
                c = Child()          # 子类实例
                c.myMethod()         # 子类调用重写方法
                super(Child,c).myMethod() #用子类对象调用父类已被覆盖的方法
            私有类 两个下划线开头


type(a),isinstance(a, int)  isinstance()会认为子类是一种父类类型。


附录：
    一、数字
        1、运算符优先级
            **  指数 (最高优先级)
            ~ + -   按位翻转, 一元加号和减号 (最后两个的方法名为 +@ 和 -@)
            * / % //    乘，除，取模和取整除
            + - 加法减法
            >> <<   右移，左移运算符
            &   位 'AND'
            ^ | 位运算符
            <= < > >=   比较运算符
            <> == !=    等于运算符
            = %= /= //= -= += *= **=    赋值运算符
            is is not   身份运算符
            in not in   成员运算符
            and or not  逻辑运算符
        2、转换函数
            int(x [,base])   将x转换为一个整数
            float(x)   将x转换到一个浮点数
            complex(real [,imag])   创建一个复数
            str(x)   将对象 x 转换为字符串
            repr(x)   将对象 x 转换为表达式字符串
            eval(str[, globals[, locals]])   用来计算在字符串中的有效Python表达式,并返回一个对象
            tuple(s)   将序列 s 转换为一个元组
            list(s)   将序列 s 转换为一个列表
            set(s)   转换为可变集合
            dict(d)   创建一个字典。d 必须是一个序列 (key,value)元组。
            frozenset(s)   转换为不可变集合
            chr(x)   将一个整数转换为一个字符 range（256）内的（就是0～255）整数作参数
            ord(x)   将一个字符转换为它的整数值
            hex(x)   将一个整数转换为一个十六进制字符串
            oct(x)   将一个整数转换为一个八进制字符串
        3、数学函数
            abs(x)  返回数字的绝对值，如abs(-10) 返回 10
            max(x1, x2,...) 返回给定参数的最大值，参数可以为序列。
            min(x1, x2,...) 返回给定参数的最小值，参数可以为序列。
            round(x [,n]) '精度有问题,别用,round(2.5)=2,round(2.355,2)=2.35'返回浮点数x的四舍五入值，如给出n值，则代表舍入到小数点后的位数。
            math.fabs(x) 返回数字的绝对值，如math.fabs(-10) 返回 10.0,'不可以复数'
            math.ceil(x) 返回数字的上入整数，如 math.ceil(4.1) 返回 5
            math.floor(x)    返回数字的下舍整数，如math.floor(4.9)返回 4
            math.exp(x)  返回e的x次幂(ex),如math.exp(1) 返回 2.718281828459045
            math.log(x)  如math.log(math.e)返回 1.0,math.log(100,10)返回 2.0
            math.log10(x)    返回以10为基数的x的对数，如math.log10(100)返回 2.0
            math.modf(x) 返回x的整数部分与小数部分，两部分的数值符号与x相同，整数部分以浮点型表示。会保留精度
            math.pow(x, y)   x**y 运算后的值。
            math.sqrt(x) 返回数字x的平方根。
            # cmp(x, y) import operator 使用 (x>y)-(x<y) 替换。如果 x < y 返回 -1, 如果 x == y 返回 0, 如果 x > y 返回 1。 Python 3 已废弃 。
        4、随机数函数
            range([start,] stop [,step]) 范围[a,b)
            random.choice(seq) 'range 数组 string'从序列的元素中随机挑选一个元素，比如random.choice(range(10))，从0到9中随机挑选一个整数。
            random.randrange ([start,] stop [,step])  '==random.choice(range())' 从指定范围内，按指定基数递增的集合中获取一个随机数，基数缺省值为1
            random.random()    随机生成下一个实数，它在[0,1)范围内。
            random.seed([x])   改变随机数生成器的种子seed。如果你不了解其原理，你不必特别去设定seed，Python会帮你选择seed。
            random.shuffle(lst)    将序列的所有元素随机排序
            random.uniform(x, y)   随机生成下一个实数，它在[x,y]范围内。
            random.randint(x,y)   随机生成下一个整数，它在[x,y]范围内。
            random.sample(seq,len)   从指定的序列中，随机的截取指定长度的片断，不修改原序列
        5、三角函数
            math.acos(x) 返回x的反余弦弧度值。
            math.asin(x) 返回x的反正弦弧度值。
            math.atan(x) 返回x的反正切弧度值。
            math.atan2(y, x) 返回给定的 X 及 Y 坐标值的反正切值。
            math.cos(x)  返回x的弧度的余弦值。
            math.hypot(x, y) 返回欧几里德范数 sqrt(x*x + y*y)。
            math.sin(x)  返回的x弧度的正弦值。
            math.tan(x)  返回x弧度的正切值。
            math.degrees(x)  将弧度转换为角度,如degrees(math.pi/2) ， 返回 90.0
            math.radians(x)  将角度转换为弧度
        6、数学常量
            math.pi  数学常量 pi（圆周率，一般以π来表示）
            math.e   数学常量 e，e即自然常数（自然常数）。

    二、字符串
        1、转义字符
            \ (在行尾时) 续行符
            \\  反斜杠符号
            \'  单引号
            \"  双引号
            \a  响铃
            \b  退格(Backspace)
            \e  转义
            \000    空
            \n  换行
            \v  纵向制表符
            \t  横向制表符
            \r  回车
            \f  换页
            \oyy    八进制数，yy代表的字符，例如：\o12代表换行
            \xyy    十六进制数，yy代表的字符，例如：\x0a代表换行
            \other  其它的字符以普通格式输出
        2、字符串运算符
            +   字符串连接   a + b 输出结果： HelloPython
            *   重复输出字符串 a*2 输出结果：HelloHello
            []  通过索引获取字符串中字符    a[1] 输出结果 e
            [ : :step]   截取字符串中的一部分，遵循左闭右开原则，str[0,2] 是不包含第 3 个字符的。  a[1:4] 输出结果 ell
            in  成员运算符 - 如果字符串中包含给定的字符返回 True    'H' in a 输出结果 True
            not in  成员运算符 - 如果字符串中不包含给定的字符返回 True   'M' not in a 输出结果 True
            r/R 原始字符串 - 原始字符串：所有的字符串都是直接按照字面的意思来使用，没有转义特殊或不能打印的字符。 原始字符串除在字符串的第一个引号前加上字母 r（可以大小写）以外，与普通字符串有着几乎完全相同的语法。
            %   格式字符串
        3、字符串格式化
            %c   格式化字符及其ASCII码
            %s   格式化字符串
            %d   格式化整数
            %u   格式化无符号整型
            %o   格式化无符号八进制数
            %x   格式化无符号十六进制数
            %X   格式化无符号十六进制数（大写）
            %f   格式化浮点数字，可指定小数点后的精度
            %e   用科学计数法格式化浮点数
            %E   作用同%e，用科学计数法格式化浮点数
            %g   %f和%e的简写
            %G   %f 和 %E 的简写
            %p   用十六进制数格式化变量的地址
                *   定义宽度或者小数点精度
                -   用做左对齐
                +   在正数前面显示加号( + )
                <sp>    在正数前面显示空格
                #   在八进制数前面显示零('0')，在十六进制前面显示'0x'或者'0X'(取决于用的是'x'还是'X')
                0   显示的数字前面填充'0'而不是默认的空格
                %   '%%'输出一个单一的'%'
                (var)   映射变量(字典参数)
                m.n.    m 是显示的最小总宽度,n 是小数点后的位数(如果可用的话)
        4、字符串函数
            len(string) 返回字符串长度
            .capitalize() 将字符串的第一个字符转换为大写，非字母不转，其他改为小写
            .max(str) 返回字符串 str 中最大的字母。
            .min(str) 返回字符串 str 中最小的字母。
            .replace(old, new [, max]) '替换'把 将字符串中的 str1 替换成 str2,如果 max 指定，则替换不超过 max 次。
            .split(str="", num=string.count(str)) num=string.count(str)) 以 str 为分隔符截取字符串，如果 num 有指定值，则仅截取 num 个子字符串
            .splitlines([keepends]) 按照行('\r', '\r\n', '\n')分隔，返回一个包含各行作为元素的列表，如果参数 keepends 为 False，不包含换行符，如果为 True，则保留换行符。
            .center(width, fillchar) '左右填充'返回一个指定的宽度 width 居中的字符串，fillchar 为填充的字符，默认为空格。
            .ljust(width[, fillchar]) '左对齐填充'返回一个原字符串左对齐,并使用 fillchar 填充至长度 width 的新字符串，fillchar 默认为空格。
            .rjust(width,[, fillchar]) '右对齐填充'返回一个原字符串右对齐,并使用fillchar(默认空格）填充至长度 width 的新字符串
            .strip([chars]) '左右截取'在字符串上执行 lstrip()和 rstrip()
            .lstrip() '左截取'截掉字符串左边的空格或指定字符。
            .rstrip() '右截取'删除字符串字符串末尾的空格.
            .lower() '转小写'转换字符串中所有大写字符为小写.
            .upper() '转大写'转换字符串中的小写字母为大写
            .swapcase() '大小写反'将字符串中大写转换为小写，小写转换为大写
            .count(str, beg= 0,end=len(string)) 'collections.Counter  统计个数' 返回 str 在 string 里面出现的次数，如果 beg 或者 end 指定则返回指定范围内 str 出现的次数
            bytes.decode(encoding="utf-8", errors="strict") Python3 中没有 decode 方法，但我们可以使用 bytes 对象的 decode() 方法来解码给定的 bytes 对象，这个 bytes 对象可以由 str.encode() 来编码返回。
            .encode(encoding='UTF-8',errors='strict') 以 encoding 指定的编码格式编码字符串，如果出错默认报一个ValueError 的异常，除非 errors 指定的是'ignore'或者'replace'
            .startswith(str, beg=0,end=len(string)) 检查字符串是否是以 obj 开头，是则返回 True，否则返回 False。如果beg 和 end 指定值，则在指定范围内检查。
            .endswith(suffix, beg=0, end=len(string)) 'end 以1开始'检查字符串是否以 obj 结束，如果beg 或者 end 指定则检查指定的范围内是否以 obj 结束，如果是，返回 True,否则返回 False.
            .expandtabs(tabsize=8) 把字符串 string 中的 tab 符号转为空格，tab 符号默认的空格数是 8 。
            .find(str, beg=0 end=len(string)) 检测 str 是否包含在字符串中，如果指定范围 beg 和 end ，则检查是否包含在指定范围内，如果包含返回开始的索引值，否则返回-1
            .index(str, beg=0, end=len(string)) 跟find()方法一样，只不过如果str不在字符串中会报一个异常.
            .rfind(str, beg=0,end=len(string)) 类似于 find()函数，不过是从右边开始查找.
            .rindex( str, beg=0, end=len(string)) 类似于 index()，不过是从右边开始.
            .isalnum() '全数字字母'如果字符串至少有一个字符并且所有字符都是字母或数字则返 回 True,否则返回 False
            .isalpha() '全字母'如果字符串至少有一个字符并且所有字符都是字母则返回 True, 否则返回 False
            .isdigit() '全数字'如果字符串只包含数字则返回 True 否则返回 False..
            .islower() '有字母全小写'如果字符串中包含至少一个区分大小写的字符，并且所有这些(区分大小写的)字符都是小写，则返回 True，否则返回 False
            .isnumeric() '全数字，中文'如果字符串中只包含数字字符，则返回 True，否则返回 False
            .isspace() '全空格\t\r\n'如果字符串中只包含空白，则返回 True，否则返回 False.
            .title() '非字母后的第一个字母大写'返回"标题化"的字符串,就是说所有单词都是以大写开始，其余字母均为小写(见 istitle())
            .istitle() '全部单词首字大写其他小写'如果字符串是标题化的(见 title())则返回 True，否则返回 False
            .isupper() '有字母全大写'如果字符串中包含至少一个区分大小写的字符，并且所有这些(区分大小写的)字符都是大写，则返回 True，否则返回 False
            .join(seq) '和js相反'以指定字符串作为分隔符，将 seq 中所有的元素(的字符串表示)合并为一个新的字符串
            .maketrans() '创建映射table'创建字符映射的转换表，对于接受两个参数的最简单的调用方式，第一个参数是字符串，表示需要转换的字符，第二个参数也是字符串表示转换的目标。
            .translate(table, deletechars="") 根据 str 给出的表(包含 256 个字符)转换 string 的字符, 要过滤掉的字符放到 deletechars 参数中
            .zfill (width) '前导0'返回长度为 width 的字符串，原字符串右对齐，前面填充0
            .isdecimal() 检查字符串是否只包含十进制字符，如果是返回 true，否则返回 false。
            .partition(sep)  --> (head,sep,tail) 从左向右遇到分隔符把字符串分割成两部分，返回头、分割符、尾三部分的三元组。如果没有找到分割符，就返回头、尾两个空元素的三元组

    三、数组
        1、列表
            del list[n] / list[n:m] / list[:]
            len(list) 列表元素个数
            max(list) 返回列表元素最大值
            min(list) 返回列表元素最小值
            list(seq) 将元组转换为列表
            .append(obj) 在列表末尾添加新的对象
            .extend(seq) '加数组多元素，加str多chr'在列表末尾一次性追加另一个序列中的多个值（用新列表扩展原来的列表）
            .count(obj) 统计某个元素在列表中出现的次数
            .index(obj) 从列表中找出某个值第一个匹配项的索引位置
            .insert(index, obj) 将对象插入列表
            .pop([index=-1]) 移除列表中的一个元素（默认最后一个元素），并且返回该元素的值
            .remove(obj) 移除列表中某个值的第一个匹配项
            .reverse() 反向列表中元素
            .sort(cmp=None, key=None, reverse=False) 对原列表进行排序
                list.sort(key=lambda ele:ele[1]+ele[0])先根据第2个元素排序，再根据第1个元素排序
            .clear() 'del a[:]'清空列表
            .copy() 'a[:]'复制列表
        2、字典
            len(dict) 计算字典元素个数，即键的总数。
            str(dict) 输出字典，以可打印的字符串表示。
            type(variable) 返回输入的变量类型，如果变量是字典就返回字典类型。
            key in dict 如果键在字典dict里返回true，否则返回false
            .clear() 删除字典内所有元素
            .copy() 返回一个字典的浅复制
            .fromkeys(seq[, value]) '返回新字典'创建一个新字典，以序列seq中元素做字典的键，val为字典所有键对应的初始值
            .get(key, default=None) 返回指定键的值，如果值不在字典中返回default值
            .items() 以列表返回可遍历的(键, 值) 元组数组
            .keys() 返回一个迭代器，可以使用 list() 来转换为列表
            .setdefault(key, default=None) 和get()类似, 但如果键不存在于字典中，将会添加键并将值设为default
            .update(dict2) '旧前新后'把字典dict2的键/值对更新到dict里
            .values() 返回一个迭代器，可以使用 list() 来转换为列表
            .pop(key[,default]) '不存在的话不加def会报错'删除字典给定键 key 所对应的值，返回值为被删除的值。key值必须给出。 否则，返回default值。
            .popitem() 随机返回并删除字典中的一对键和值(一般删除末尾对)。
        3、集合
            len(s)
            .add( x ) 将元素 x 添加到集合 s 中，如果元素已存在，则不进行任何操作。
            .update( x ) "str会转chr"参数可以是列表，元组，字典等
            .remove( x ) 将元素 x 添加到集合 s 中移除，如果元素不存在，则会发生错误
            .discard( x ) 移除集合中的元素，且如果元素不存在，不会发生错误。
            .pop() 随机删除，一般最左
            .clear()
            x in s

    四、读写文件
        f=open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)
        # file: 必需，文件路径（相对或者绝对路径）。
        # mode: 可选，文件打开模式
        # buffering: 设置缓冲
        # encoding: 一般使用utf8
        # errors: 报错级别
        # newline: 区分换行符
        # closefd: 传入的file参数类型
        # opener:
            r   #只读，以只读方式打开文件。文件的指针将会放在文件的开头。这是默认模式。
            rb  #，以二进制格式打开一个文件用于只读。文件指针将会放在文件的开头。
            r+  #读写头部追加，打开一个文件用于读写。文件指针将会放在文件的开头。
            rb+ #，以二进制格式打开一个文件用于读写。文件指针将会放在文件的开头。
            w   #只写直接清空文件，打开一个文件只用于写入。如果该文件已存在则打开文件，并从开头开始编辑，即原有内容会被删除。如果该文件不存在，创建新文件。
            wb  #，以二进制格式打开一个文件只用于写入。如果该文件已存在则打开文件，并从开头开始编辑，即原有内容会被删除。如果该文件不存在，创建新文件。
            w+  #读写，打开一个文件用于读写。如果该文件已存在则打开文件，并从开头开始编辑，即原有内容会被删除。如果该文件不存在，创建新文件。
            wb+ #，以二进制格式打开一个文件用于读写。如果该文件已存在则打开文件，并从开头开始编辑，即原有内容会被删除。如果该文件不存在，创建新文件。
            a   #只写追加，打开一个文件用于追加。如果该文件已存在，文件指针将会放在文件的结尾。也就是说，新的内容将会被写入到已有内容之后。如果该文件不存在，创建新文件进行写入。
            ab  #，以二进制格式打开一个文件用于追加。如果该文件已存在，文件指针将会放在文件的结尾。也就是说，新的内容将会被写入到已有内容之后。如果该文件不存在，创建新文件进行写入。
            a+  #读写尾部追加，打开一个文件用于读写。如果该文件已存在，文件指针将会放在文件的结尾。文件打开时会是追加模式。如果该文件不存在，创建新文件用于读写。
            ab+ #，以二进制格式打开一个文件用于追加。如果该文件已存在，文件指针将会放在文件的结尾。如果该文件不存在，创建新文件用于读写。
        file.close()关闭文件。关闭后文件不能再进行读写操作。
        file.flush()刷新文件内部缓冲，直接把内部缓冲区的数据立刻写入文件, 而不是被动的等待输出缓冲区写入。
        file.fileno()返回一个整型的文件描述符(file descriptor FD 整型), 可以用在如os模块的read方法等一些底层操作上。
        file.isatty()如果文件连接到一个终端设备返回 True，否则返回 False。
        file.next(iterator[,default])返回文件下一行。
        file.read([size])从文件读取指定的字节数，如果未给定或为负则读取所有。
        file.readline([size])读取整行，包括 "\n" 字符。
        file.readlines([sizeint])读取所有行并返回列表，若给定sizeint>0，返回总和大约为sizeint字节的行, 实际读取值可能比 sizeint 较大, 因为需要填充缓冲区。
        file.seek(offset[, whence])设置文件当前位置
        file.tell()返回文件当前位置。
        file.truncate([size])从文件的首行首字符开始截断，截断文件为 size 个字符，无 size 表示从当前位置截断；截断之后后面的所有字符被删除，其中 Widnows 系统下的换行代表2个字符大小。
        file.write(str)将字符串写入文件，返回的是写入的字符长度。
        file.writelines(sequence)向文件写入一个序列字符串列表，如果需要换行则要自己加入每行的换行符。
        pickle
            pickle.dump(obj, file, [,protocol])
            x = pickle.load(file)
        OS
            os.access(path, mode)检验权限模式
            os.chdir(path)改变当前工作目录
            os.chflags(path, flags)设置路径的标记为数字标记。
            os.chmod(path, mode)更改权限
            os.chown(path, uid, gid)更改文件所有者
            os.chroot(path)改变当前进程的根目录
            os.close(fd)关闭文件描述符 fd
            os.closerange(fd_low, fd_high)关闭所有文件描述符，从 fd_low (包含) 到 fd_high (不包含), 错误会忽略
            os.dup(fd)复制文件描述符 fd
            os.dup2(fd, fd2)将一个文件描述符 fd 复制到另一个 fd2
            os.fchdir(fd)通过文件描述符改变当前工作目录
            os.fchmod(fd, mode)改变一个文件的访问权限，该文件由参数fd指定，参数mode是Unix下的文件访问权限。
            os.fchown(fd, uid, gid)修改一个文件的所有权，这个函数修改一个文件的用户ID和用户组ID，该文件由文件描述符fd指定。
            os.fdatasync(fd)强制将文件写入磁盘，该文件由文件描述符fd指定，但是不强制更新文件的状态信息。
            os.fdopen(fd[, mode[, bufsize]])通过文件描述符 fd 创建一个文件对象，并返回这个文件对象
            os.fpathconf(fd, name)返回一个打开的文件的系统配置信息。name为检索的系统配置的值，它也许是一个定义系统值的字符串，这些名字在很多标准中指定（POSIX.1, Unix 95, Unix 98, 和其它）。
            os.fstat(fd)返回文件描述符fd的状态，像stat()。
            os.fstatvfs(fd)返回包含文件描述符fd的文件的文件系统的信息，像 statvfs()
            os.fsync(fd)强制将文件描述符为fd的文件写入硬盘。
            os.ftruncate(fd, length)裁剪文件描述符fd对应的文件, 所以它最大不能超过文件大小。
            os.getcwd()返回当前工作目录
            os.getcwdu()返回一个当前工作目录的Unicode对象
            os.isatty(fd)如果文件描述符fd是打开的，同时与tty(-like)设备相连，则返回true, 否则False。
            os.lchflags(path, flags)设置路径的标记为数字标记，类似 chflags()，但是没有软链接
            os.lchmod(path, mode)修改连接文件权限
            os.lchown(path, uid, gid)更改文件所有者，类似 chown，但是不追踪链接。
            os.link(src, dst)创建硬链接，名为参数 dst，指向参数 src
            os.listdir(path)返回path指定的文件夹包含的文件或文件夹的名字的列表。
            os.lseek(fd, pos, how)设置文件描述符 fd当前位置为pos, how方式修改: SEEK_SET 或者 0 设置从文件开始的计算的pos; SEEK_CUR或者 1 则从当前位置计算; os.SEEK_END或者2则从文件尾部开始. 在unix，Windows中有效
            os.lstat(path)像stat(),但是没有软链接
            os.major(device)从原始的设备号中提取设备major号码 (使用stat中的st_dev或者st_rdev field)。
            os.makedev(major, minor)以major和minor设备号组成一个原始设备号
            os.makedirs(path[, mode])递归文件夹创建函数。像mkdir(), 但创建的所有intermediate-level文件夹需要包含子文件夹。
            os.minor(device)从原始的设备号中提取设备minor号码 (使用stat中的st_dev或者st_rdev field )。
            os.mkdir(path[, mode])以数字mode的mode创建一个名为path的文件夹.默认的 mode 是 0777 (八进制)。
            os.mkfifo(path[, mode])创建命名管道，mode 为数字，默认为 0666 (八进制)
            os.mknod(filename[, mode=0600, device])创建一个名为filename文件系统节点（文件，设备特别文件或者命名pipe）。
            os.open(file, flags[, mode])打开一个文件，并且设置需要的打开选项，mode参数是可选的
            os.openpty()打开一个新的伪终端对。返回 pty 和 tty的文件描述符。
            os.pathconf(path, name)返回相关文件的系统配置信息。
            os.pipe()创建一个管道. 返回一对文件描述符(r, w) 分别为读和写
            os.popen(command[, mode[, bufsize]])从一个 command 打开一个管道
            os.read(fd, n)从文件描述符 fd 中读取最多 n 个字节，返回包含读取字节的字符串，文件描述符 fd对应文件已达到结尾, 返回一个空字符串。
            os.readlink(path)返回软链接所指向的文件
            os.remove(path)删除路径为path的文件。如果path 是一个文件夹，将抛出OSError; 查看下面的rmdir()删除一个 directory。
            os.removedirs(path)递归删除目录。
            os.rename(src, dst)重命名文件或目录，从 src 到 dst
            os.renames(old, new)递归地对目录进行更名，也可以对文件进行更名。
            os.rmdir(path)删除path指定的空目录，如果目录非空，则抛出一个OSError异常。
            os.stat(path)获取path指定的路径的信息，功能等同于C API中的stat()系统调用。
            os.stat_float_times([newvalue])决定stat_result是否以float对象显示时间戳
            os.statvfs(path)获取指定路径的文件系统统计信息
            os.symlink(src, dst)创建一个软链接
            os.tcgetpgrp(fd)返回与终端fd（一个由os.open()返回的打开的文件描述符）关联的进程组
            os.tcsetpgrp(fd, pg)设置与终端fd（一个由os.open()返回的打开的文件描述符）关联的进程组为pg。
            os.tempnam([dir[, prefix]])Python3 中已删除。返回唯一的路径名用于创建临时文件。
            os.tmpfile()Python3 中已删除。返回一个打开的模式为(w+b)的文件对象 .这文件对象没有文件夹入口，没有文件描述符，将会自动删除。
            os.tmpnam()Python3 中已删除。为创建一个临时文件返回一个唯一的路径
            os.ttyname(fd)返回一个字符串，它表示与文件描述符fd 关联的终端设备。如果fd 没有与终端设备关联，则引发一个异常。
            os.unlink(path)删除文件路径
            os.utime(path, times)返回指定的path文件的访问和修改的时间。
            os.walk(top[, topdown=True[, onerror=None[, followlinks=False]]])输出在文件夹中的文件名通过在树中游走，向上或者向下。
            os.write(fd, str)写入字符串到文件描述符 fd中. 返回实际写入的字符串长度

    五、面向对象
        概念
            类Class: 用来描述具有相同的属性和方法的对象的集合。它定义了该集合中每个对象所共有的属性和方法。对象是类的实例。
            方法：类中定义的函数。
            类变量：类变量在整个实例化的对象中是公用的。类变量定义在类中且在函数体之外。类变量通常不作为实例变量使用。
            数据成员：类变量或者实例变量用于处理类及其实例对象的相关的数据。
            方法重写：如果从父类继承的方法不能满足子类的需求，可以对其进行改写，这个过程叫方法的覆盖（override），也称为方法的重写。
            实例变量：定义在方法中的变量，只作用于当前实例的类。
            继承：即一个派生类（derived class）继承基类（base class）的字段和方法。继承也允许把一个派生类的对象作为一个基类对象对待。例如，有这样一个设计：一个Dog类型的对象派生自Animal类，这是模拟"是一个（is-a）"关系（例图，Dog是一个Animal）。
            实例化：创建一个类的实例，类的具体对象。
            对象：通过类定义的数据结构实例。对象包括两个数据成员（类变量和实例变量）和方法
        类私有方法
            __init__ : 构造函数，在生成对象时调用
            __del__ : 析构函数，释放对象时使用
            __repr__ : 打印，转换
            __setitem__ : 按照索引赋值
            __getitem__: 按照索引获取值
            __len__: 获得长度
            __cmp__: 比较运算
            __call__: 函数调用
            正向运算符重载：self+x
                __add__: 加运算
                __sub__: 减运算
                __mul__: 乘运算
                __div__: 除运算
                __mod__: 求余运算
                __pow__: 乘方
            反向运算符重载：x+self
                __radd__: 加运算
                __rsub__: 减运算
                __rmul__: 乘运算
                __rdiv__: 除运算
                __rmod__: 求余运算
                __rpow__: 乘方
            复合重载运算符：self+=x
                __iadd__: 加运算
                __isub__: 减运算
                __imul__: 乘运算
                __idiv__: 除运算
                __imod__: 求余运算
                __ipow__: 乘方
        装饰器
            静态方法: 用 @staticmethod 装饰的不带 self 参数的方法叫做静态方法，类的静态方法可以没有参数，可以直接使用类名调用。
            类方法: 默认有个 cls 参数，可以被类和对象调用，需要加上 @classmethod 装饰器。
            普通方法: 默认有个self参数，且只能被对象调用。

    六、标准库 dir help
        操作系统接口：文件管理
            os
            shutil.copyfile("a.py","b.py") shutil.move()
        文件通配符：搜索文件
            glob.glob('*.py')
        命令行参数：cmd参数
            sys.argv
        错误输出重定向和程序终止
            sys.stderr.write('Warning') sys.exit()
        字符串正则匹配
            re.match(pattern, string, flags=0)
            re.findall(r'\bf[a-z]*', 'which foot or hand fell fastest')
            re.sub(r'(\b[a-z]+) \1', r'\1', 'cat in the the hat')
        数学
            math
            random
        访问互联网
            urllib.request.urlopen
            smtplib
        日期和时间
            datetime.date
        数据压缩
            zlib.compress
            zlib.decompress
        性能度量
            timeit.Timer
        测试模块
            doctest.testmod()
            unittest.main()
        数据库
            mysql.connector.connect()
            pymysql.connect
        多线程
            threading


    七、内置函数
        abs()   dict()  help()  min()   setattr()
        all()   dir()   hex()   next()  slice()
        any()   divmod()    id()    object()    sorted()
        ascii() enumerate() input() oct()   staticmethod()
        bin()   eval()  int()   open()  str()
        bool()  exec()  isinstance()    ord()   sum()
        bytearray() filter()    issubclass()    pow()   super()
        bytes() float() iter()  print() tuple()
        callable()  format()    len()   property()  type()
        chr()   frozenset() list()  range() vars()
        classmethod()   getattr()   locals()    repr()  zip()
        compile()   globals()   map()   reversed()  __import__()
        complex()   hasattr()   max()   round()
        delattr()   hash()  memoryview()    set()