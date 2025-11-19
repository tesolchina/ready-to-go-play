import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertCircle, Lightbulb, Target, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const InteractiveLearningReflection = () => {
  const { toast } = useToast();
  const [reflection1, setReflection1] = useState("");
  const [reflection2, setReflection2] = useState("");
  const [practiceResponse, setPracticeResponse] = useState("");

  const handleSaveReflection = (type: string) => {
    toast({
      title: "反思已保存",
      description: "您的思考已记录",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-8 bg-background">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <Link to="/lessons">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回课程列表
                </Button>
              </Link>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                    第一课 | Lesson 1
                  </span>
                </div>
                <h1 className="text-4xl font-bold">
                  从传统讲授到互动学习：教学模式的反思与实践
                </h1>
                <p className="text-xl text-muted-foreground">
                  Reflecting on Lecturing: Towards Interactive Learning with AI
                </p>
              </div>
            </div>

            {/* Section 1: The Problem */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                  问题所在：传统讲授模式的困境
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed">
                    在传统的大学英语课堂中，教师往往采用"单向传授"的教学模式：教师讲，学生听。
                    这种模式在信息传递效率上看似高效，但实际上存在诸多问题：
                  </p>
                  
                  <ul className="space-y-3 text-foreground">
                    <li>
                      <strong>学生参与度低</strong>：被动接收信息导致注意力分散，学习动机不足
                    </li>
                    <li>
                      <strong>个性化缺失</strong>：无法照顾到不同水平学生的具体需求
                    </li>
                    <li>
                      <strong>反馈延迟</strong>：教师难以及时了解每位学生的理解程度
                    </li>
                    <li>
                      <strong>实践机会少</strong>：语言学习需要大量练习，但课堂时间有限
                    </li>
                    <li>
                      <strong>知识迁移困难</strong>：学生难以将所学应用到真实语境中
                    </li>
                  </ul>

                  <blockquote className="border-l-4 border-muted pl-4 italic text-muted-foreground">
                    "Tell me and I forget, teach me and I may remember, involve me and I learn."
                    <br />— Benjamin Franklin
                  </blockquote>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-foreground">💭 批判性思考</h4>
                  <Textarea
                    placeholder="请反思：在您的教学实践中，是否也遇到过这些问题？您认为最大的挑战是什么？"
                    value={reflection1}
                    onChange={(e) => setReflection1(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button onClick={() => handleSaveReflection("problem")} variant="secondary">
                    保存反思
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: The New Approach */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  新的可能：互动学习与AI辅助
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed">
                    互动学习模式强调"学生为中心"，而AI技术的融入为这一模式提供了前所未有的可能性：
                  </p>

                  <h4 className="text-xl font-semibold text-foreground mt-6 mb-3">核心理念</h4>
                  <div className="grid gap-4">
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">1. 从"教师讲授"到"学生探索"</h5>
                      <p className="text-muted-foreground">
                        教师的角色从"知识传递者"转变为"学习引导者"，学生通过问题导向的探索主动构建知识
                      </p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">2. 从"统一进度"到"个性化学习"</h5>
                      <p className="text-muted-foreground">
                        AI可以根据每位学生的水平和需求提供定制化的学习内容和即时反馈
                      </p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">3. 从"课堂学习"到"随时随地学习"</h5>
                      <p className="text-muted-foreground">
                        学生可以随时与AI对话，获得写作建议、语法解释、表达优化等支持
                      </p>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">4. 从"教师监督"到"智能追踪"</h5>
                      <p className="text-muted-foreground">
                        系统可以追踪学生的学习进度和困难点，帮助教师更精准地调整教学策略
                      </p>
                    </div>
                  </div>

                  <h4 className="text-xl font-semibold text-foreground mt-6 mb-3">实施框架</h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h5 className="font-semibold text-foreground">课前：翻转课堂</h5>
                      <p className="text-muted-foreground">
                        学生通过视频、阅读材料自主预习，AI助手回答预习中的问题
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h5 className="font-semibold text-foreground">课中：互动实践</h5>
                      <p className="text-muted-foreground">
                        教师组织讨论、项目活动，AI辅助小组协作和即时反馈
                      </p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <h5 className="font-semibold text-foreground">课后：持续练习</h5>
                      <p className="text-muted-foreground">
                        学生通过AI进行写作练习、口语对话，获得个性化的改进建议
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Practice */}
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-yellow-600" />
                  实践练习：设计一个互动学习活动
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed">
                    请基于您当前的教学内容，设计一个融合AI辅助的互动学习活动。
                  </p>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg space-y-2">
                    <h5 className="font-semibold text-foreground">💡 设计要点</h5>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>明确学习目标（学生需要掌握什么？）</li>
                      <li>设计学生的主动探索环节（如何激发学生参与？）</li>
                      <li>说明AI的辅助作用（AI在哪些环节提供支持？）</li>
                      <li>设置即时反馈机制（学生如何知道自己的进步？）</li>
                      <li>考虑不同水平学生的需求（如何实现个性化？）</li>
                    </ul>
                  </div>
                </div>

                <Textarea
                  placeholder="在这里描述您设计的互动学习活动..."
                  value={practiceResponse}
                  onChange={(e) => setPracticeResponse(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button onClick={() => handleSaveReflection("practice")} className="w-full">
                  提交设计方案
                </Button>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-semibold text-foreground mb-2">💬 讨论提示</h5>
                  <p className="text-muted-foreground text-sm">
                    完成设计后，您可以与AI讨论您的方案，获得改进建议。
                    例如询问："我设计的活动是否能有效提高学生参与度？""如何更好地利用AI技术？"
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Reflection */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  深度反思：教学模式的转变
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed">
                    从讲授式教学到互动学习的转变，不仅是方法的改变，更是教学理念的转型。
                  </p>

                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">🔍 反思问题</h5>
                      <ol className="space-y-3 text-muted-foreground">
                        <li>
                          <strong className="text-foreground">角色转变：</strong>
                          从"知识权威"到"学习伙伴"，这对您意味着什么？您准备好了吗？
                        </li>
                        <li>
                          <strong className="text-foreground">信任与控制：</strong>
                          让学生更多地自主探索，您是否担心失去对课堂的控制？
                        </li>
                        <li>
                          <strong className="text-foreground">技术与人文：</strong>
                          AI可以提供反馈，但教师的独特价值是什么？
                        </li>
                        <li>
                          <strong className="text-foreground">挑战与准备：</strong>
                          实施这种模式，您认为最大的障碍是什么？需要哪些支持？
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                <Textarea
                  placeholder="请写下您的深度反思..."
                  value={reflection2}
                  onChange={(e) => setReflection2(e.target.value)}
                  className="min-h-[150px]"
                />
                <Button onClick={() => handleSaveReflection("deep")} variant="secondary" className="w-full">
                  保存反思
                </Button>

                <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                  <h5 className="font-semibold text-foreground">📚 延伸阅读</h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      • Freeman, S. et al. (2014). Active learning increases student performance in science, engineering, and mathematics. 
                      <em className="text-primary"> PNAS, 111(23)</em>
                    </li>
                    <li>
                      • Prince, M. (2004). Does active learning work? A review of the research. 
                      <em className="text-primary"> Journal of Engineering Education</em>
                    </li>
                    <li>
                      • 李晓明 (2023). 人工智能赋能高等教育的路径与挑战. 
                      <em className="text-primary"> 中国高教研究</em>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">🎯 下一步</h3>
                  <p className="text-muted-foreground">
                    完成本课程后，尝试在您的下一堂课中实施一个小的互动学习活动，
                    并观察学生的反应和参与度变化。
                  </p>
                  <div className="flex justify-center gap-4">
                    <Link to="/lessons">
                      <Button variant="outline">
                        返回课程列表
                      </Button>
                    </Link>
                    <Button>
                      分享您的反思
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default InteractiveLearningReflection;
