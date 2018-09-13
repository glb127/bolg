
1、基本类型
    string 字符串
        反斜杠可以用来转义，使用r可以不发生转义。   r"\n"
        按字面意义级联字符串。   "this " "is " 会被自动转换为this is
        用 * 运算符重复。   "a"*3
        切片  字符串[头下标:尾下标]
        print( x, end="" )不换行
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
    Tuple 元组
        (),与数组不同是不能修改
        空元祖()  一个元素(20,)
    Set 集合
        {} set()
        set('abcab')={'a','b','c','a','b'}=={'a','b','c'}
        'a' in student
        (a - b)     # a和b的差集
        (a | b)     # a和b的并集
        (a & b)     # a和b的交集
        (a ^ b)     # a和b中不同时存在的元素
    Dictionary 字典
        dic = {} dic[1] = 'one' dic['one'] = 1
        key唯一
        dic.keys() .values() .clear()
        {x: x**2 for x in (2, 4, 6)}  {2: 4, 4: 16, 6: 36}
        dict() 可以直接从键值对序列中构建字典
        dict([('a', 1), ('b', 2)])=dict(a=1, b=2)=dict(zip(['a', 'b'], [1, 2]))
                =={'a': 1, 'b': 2}

2、运算
    == 调用对象的 __eq__()
    // 取整除   ~ 按位取反
    and 前为 False 返回前，否则返回后值
    or 前为 True 返回前，否则返回后值
    not 取反，返回 False 或 True
    in 是否在序列中
    is 两个标识符是不是引用自一个对象，类似 id(x) == id(y)
        is 用于判断两个变量引用对象是否为同一个， == 用于判断引用变量的值是否相等。
    分数：fractions.Fraction

    def.__doc__ 函数注释




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
            .capitalize() 将字符串的第一个字符转换为大写，非字母不转，其他改为小写
            .center(width, fillchar) 返回一个指定的宽度 width 居中的字符串，fillchar 为填充的字符，默认为空格。
            .count(str, beg= 0,end=len(string)) 'collections.Counter  统计个数' 返回 str 在 string 里面出现的次数，如果 beg 或者 end 指定则返回指定范围内 str 出现的次数
            bytes.decode(encoding="utf-8", errors="strict") Python3 中没有 decode 方法，但我们可以使用 bytes 对象的 decode() 方法来解码给定的 bytes 对象，这个 bytes 对象可以由 str.encode() 来编码返回。
            encode(encoding='UTF-8',errors='strict') 以 encoding 指定的编码格式编码字符串，如果出错默认报一个ValueError 的异常，除非 errors 指定的是'ignore'或者'replace'
            endswith(suffix, beg=0, end=len(string)) 检查字符串是否以 obj 结束，如果beg 或者 end 指定则检查指定的范围内是否以 obj 结束，如果是，返回 True,否则返回 False.
            expandtabs(tabsize=8) 把字符串 string 中的 tab 符号转为空格，tab 符号默认的空格数是 8 。
            find(str, beg=0 end=len(string)) 检测 str 是否包含在字符串中，如果指定范围 beg 和 end ，则检查是否包含在指定范围内，如果包含返回开始的索引值，否则返回-1
            index(str, beg=0, end=len(string)) 跟find()方法一样，只不过如果str不在字符串中会报一个异常.
            isalnum() 如果字符串至少有一个字符并且所有字符都是字母或数字则返 回 True,否则返回 False
            isalpha() 如果字符串至少有一个字符并且所有字符都是字母则返回 True, 否则返回 False
            isdigit() 如果字符串只包含数字则返回 True 否则返回 False..
            islower() 如果字符串中包含至少一个区分大小写的字符，并且所有这些(区分大小写的)字符都是小写，则返回 True，否则返回 False
            isnumeric() 如果字符串中只包含数字字符，则返回 True，否则返回 False
            isspace() 如果字符串中只包含空白，则返回 True，否则返回 False.
            istitle() 如果字符串是标题化的(见 title())则返回 True，否则返回 False
            isupper() 如果字符串中包含至少一个区分大小写的字符，并且所有这些(区分大小写的)字符都是大写，则返回 True，否则返回 False
            join(seq) 以指定字符串作为分隔符，将 seq 中所有的元素(的字符串表示)合并为一个新的字符串
            len(string) 返回字符串长度
            ljust(width[, fillchar]) 返回一个原字符串左对齐,并使用 fillchar 填充至长度 width 的新字符串，fillchar 默认为空格。
            lower() 转换字符串中所有大写字符为小写.
            lstrip() 截掉字符串左边的空格或指定字符。
            maketrans() 创建字符映射的转换表，对于接受两个参数的最简单的调用方式，第一个参数是字符串，表示需要转换的字符，第二个参数也是字符串表示转换的目标。
            max(str) 返回字符串 str 中最大的字母。
            min(str) 返回字符串 str 中最小的字母。
            replace(old, new [, max]) 把 将字符串中的 str1 替换成 str2,如果 max 指定，则替换不超过 max 次。
            rfind(str, beg=0,end=len(string)) 类似于 find()函数，不过是从右边开始查找.
            rindex( str, beg=0, end=len(string)) 类似于 index()，不过是从右边开始.
            rjust(width,[, fillchar]) 返回一个原字符串右对齐,并使用fillchar(默认空格）填充至长度 width 的新字符串
            rstrip() 删除字符串字符串末尾的空格.
            split(str="", num=string.count(str)) num=string.count(str)) 以 str 为分隔符截取字符串，如果 num 有指定值，则仅截取 num 个子字符串
            splitlines([keepends]) 按照行('\r', '\r\n', \n')分隔，返回一个包含各行作为元素的列表，如果参数 keepends 为 False，不包含换行符，如果为 True，则保留换行符。
            startswith(str, beg=0,end=len(string)) 检查字符串是否是以 obj 开头，是则返回 True，否则返回 False。如果beg 和 end 指定值，则在指定范围内检查。
            strip([chars]) 在字符串上执行 lstrip()和 rstrip()
            swapcase() 将字符串中大写转换为小写，小写转换为大写
            title() 返回"标题化"的字符串,就是说所有单词都是以大写开始，其余字母均为小写(见 istitle())
            translate(table, deletechars="") 根据 str 给出的表(包含 256 个字符)转换 string 的字符, 要过滤掉的字符放到 deletechars 参数中
            upper() 转换字符串中的小写字母为大写
            zfill (width) 返回长度为 width 的字符串，原字符串右对齐，前面填充0
            isdecimal() 检查字符串是否只包含十进制字符，如果是返回 true，否则返回 false。
            partition(sep)  --> (head,sep,tail) 从左向右遇到分隔符把字符串分割成两部分，返回头、分割符、尾三部分的三元组。如果没有找到分割符，就返回头、尾两个空元素的三元组








