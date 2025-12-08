import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Laptop, Lightbulb, MessageSquare, ChevronDown, Terminal, Zap, ChevronUp, FileText, Key, AlertCircle, FolderOpen, GraduationCap, Microscope, Calendar, Clock, MapPin, Globe, QrCode } from "lucide-react";
import { WorkshopUseCaseChat } from "@/components/WorkshopUseCaseChat";
import { WorkshopUseCaseBBS } from "@/components/WorkshopUseCaseBBS";
import { WorkshopInterestForm } from "@/components/WorkshopInterestForm";
import wechatGroupQR from "@/assets/wechat-group-qr.jpg";
import wechatSimonQR from "@/assets/wechat-simon-qr.jpg";
import traeIdeInterface from "@/assets/trae-ide-interface.png";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import QRCode from "react-qr-code";

const WorkshopBNBU = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getTabFromHash = (hash: string) => {
    switch (hash) {
      case "#prep":
        return "preparation";
      case "#act":
        return "activities";
      case "#ref":
        return "reflection";
      default:
        return "preparation";
    }
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash(location.hash));
  const [bbsRefresh, setBbsRefresh] = useState(0);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [moduleStates, setModuleStates] = useState({
    module1: true,
    module2: true,
    module3: true,
    module4: true,
    module5: true,
    lab2: true,
    lab3: true,
  });

  const WORKSHOP_PAGE_URL = "https://eapteacher.smartutor.me/workshops/bnbuworkshop";

  useEffect(() => {
    setActiveTab(getTabFromHash(location.hash));
  }, [location.hash]);

  const collapseAll = () => {
    setModuleStates({
      module1: false,
      module2: false,
      module3: false,
      module4: false,
      module5: false,
      lab2: false,
      lab3: false,
    });
  };

  const expandAll = () => {
    setModuleStates({
      module1: true,
      module2: true,
      module3: true,
      module4: true,
      module5: true,
      lab2: true,
      lab3: true,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const hashMap: Record<string, string> = {
      preparation: "#prep",
      activities: "#act",
      reflection: "#ref",
    };
    navigate(`${location.pathname}${hashMap[value]}`, { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold lg:hidden">工作坊 Workshop</h2>
          </header>
          <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header Section */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  在集成开发环境中运用AI智能体
                </h1>
                <h2 className="text-2xl font-semibold text-muted-foreground">
                  Leveraging AI Agents in Integrated Development Environments
                </h2>
                <p className="text-xl text-muted-foreground">
                  学术研究与写作的新范式 | A New Paradigm for Academic Research and Writing
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold">
                    北师港浸大 | BNBU Zhuhai
                  </span>
                  <span className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold">
                    研究生专场 | Graduate Students
                  </span>
                </div>
              </div>

              {/* Event Info Card */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">日期 Date</p>
                        <p className="text-muted-foreground">2025年12月11日 (周四)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">时间 Time</p>
                        <p className="text-muted-foreground">15:00-16:30 讲座</p>
                        <p className="text-muted-foreground text-sm">16:30-17:30 练习与答疑</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">地点 Location</p>
                        <p className="text-muted-foreground text-sm">北师港浸大珠海</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">对象 Audience</p>
                        <p className="text-muted-foreground text-sm">博士生、硕士生</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code Toggle */}
              <div className="flex justify-center">
                <Button 
                  variant="outline"
                  onClick={() => setQrCodeVisible(!qrCodeVisible)}
                  className="gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  {qrCodeVisible ? '隐藏' : '显示'} 二维码 | {qrCodeVisible ? 'Hide' : 'Show'} QR Code
                </Button>
              </div>

              {qrCodeVisible && (
                <Card>
                  <CardContent className="flex flex-col items-center gap-4 py-6">
                    <div className="p-6 bg-white rounded-lg">
                      <QRCode value={WORKSHOP_PAGE_URL} size={200} level="H" />
                    </div>
                    <p className="text-sm text-muted-foreground">{WORKSHOP_PAGE_URL}</p>
                  </CardContent>
                </Card>
              )}

              {/* Workshop Focus */}
              <Card className="border-accent/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-accent" />
                    工作坊重点 | Workshop Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 text-foreground">
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">•</span>
                      <div>
                        <strong>研究写作辅助 | Research Writing Support</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          使用AI智能体辅助学术论文写作、文献综述 | Use AI agents for academic writing and literature reviews
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">•</span>
                      <div>
                        <strong>批量处理研究文献 | Batch Processing Literature</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          掌握使用API批量分析学术文献 | Master batch analysis of academic literature using APIs
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">•</span>
                      <div>
                        <strong>输入-处理-输出模型 | Input-Process-Output Model</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          理解AI智能体的核心工作框架 | Understand the core framework for AI agent tasks
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="w-full h-auto md:h-10 flex flex-col gap-2 md:grid md:grid-cols-3">
                  <TabsTrigger value="preparation" className="w-full justify-start md:justify-center text-xs md:text-sm px-3 py-2">
                    准备 Preparation
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="w-full justify-start md:justify-center text-xs md:text-sm px-3 py-2">
                    活动 Activities
                  </TabsTrigger>
                  <TabsTrigger value="reflection" className="w-full justify-start md:justify-center text-xs md:text-sm px-3 py-2">
                    反思 Reflection
                  </TabsTrigger>
                </TabsList>

                {/* PREPARATION TAB */}
                <TabsContent value="preparation" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Laptop className="h-5 w-5" />
                        技术准备 | Technical Setup
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">必需软件 | Required Software</h3>
                        <ul className="space-y-2 text-foreground">
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Trae IDE</strong> - 下载安装:
                              <ul className="mt-2 ml-4 space-y-1">
                                <li>• <strong>中国大陆:</strong> <a href="https://trae.cn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">trae.cn</a></li>
                                <li>• <strong>其他地区:</strong> <a href="https://trae.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">trae.ai</a></li>
                              </ul>
                            </div>
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Trae 账户</strong> - 在上述网站注册免费账户并登录
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">AI平台API密钥 | API Keys</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          选择以下平台之一获取API密钥 | Choose one platform to obtain an API key:
                        </p>
                        <ul className="space-y-3 text-foreground">
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Kimi (Moonshot AI)</strong> - <a href="https://platform.moonshot.cn/console/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.moonshot.cn</a>
                              <p className="text-sm text-muted-foreground mt-1">提供 ¥15 免费额度 | Offers CNY ¥15 free credits</p>
                            </div>
                          </li>
                          <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>DeepSeek</strong> - <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.deepseek.com</a>
                              <p className="text-sm text-muted-foreground mt-1">需充值约 ¥20-50 | May need to add funds (~¥20-50)</p>
                            </div>
                          </li>
                        </ul>
                        <Alert className="mt-4 border-destructive/50">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>重要:</strong> 生成API密钥后请立即保存，无法再次查看! | Save your API key immediately after generation!
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5" />
                        克隆工作坊仓库 | Clone Repository
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-foreground">
                        使用Trae IDE克隆工作坊材料 | Clone the workshop materials using Trae:
                      </p>
                      <ul className="space-y-3 text-foreground">
                        <li className="flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Gitee:</strong> 
                            <code className="ml-2 bg-muted px-2 py-1 rounded text-sm">TBA (待定)</code>
                          </div>
                        </li>
                      </ul>
                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <h4 className="font-semibold mb-2">克隆步骤 | Clone Steps</h4>
                        <ol className="space-y-2 text-sm">
                          <li><span className="font-semibold">1.</span> 打开Trae IDE | Open Trae IDE</li>
                          <li><span className="font-semibold">2.</span> 新建文件夹 | Create new folder</li>
                          <li><span className="font-semibold">3.</span> 在Builder对话框中输入: "Clone [仓库URL]" | Type in Builder: "Clone [repo URL]"</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ACTIVITIES TAB */}
                <TabsContent value="activities" className="space-y-6">
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const allClosed = Object.values(moduleStates).every(v => !v);
                        if (allClosed) expandAll(); else collapseAll();
                      }}
                      className="gap-2"
                    >
                      {Object.values(moduleStates).every(v => !v) ? (
                        <><ChevronDown className="h-4 w-4" /> 展开全部 Expand All</>
                      ) : (
                        <><ChevronUp className="h-4 w-4" /> 收起全部 Collapse All</>
                      )}
                    </Button>
                  </div>

                  {/* Module 1: Conceptual Understanding */}
                  <Collapsible open={moduleStates.module1} onOpenChange={(open) => setModuleStates({...moduleStates, module1: open})}>
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Lightbulb className="h-6 w-6" />
                            模块1: 概念理解 | Module 1: Conceptual Understanding
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          <h4 className="text-lg font-semibold">两种与AI交互的方式 | Two Ways to Communicate with AI</h4>
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Chatbot */}
                            <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <MessageSquare className="h-6 w-6 text-primary" />
                                <h3 className="text-xl font-bold">聊天机器人 | Chatbot</h3>
                              </div>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                  <span>基于浏览器 | Browser-based</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                  <span>直观易用 | Intuitive to use</span>
                                </li>
                                <li className="flex items-start gap-2 text-muted-foreground">
                                  <span>⚠️</span>
                                  <span>需要频繁切换上下文 | Requires context switching</span>
                                </li>
                                <li className="flex items-start gap-2 text-muted-foreground">
                                  <span>⚠️</span>
                                  <span>只能产生文本回复 | Only produces text responses</span>
                                </li>
                              </ul>
                            </div>

                            {/* AI Agent */}
                            <div className="rounded-lg border-4 border-accent bg-gradient-to-br from-accent/10 to-background p-6 shadow-lg">
                              <div className="flex items-center gap-3 mb-4">
                                <Laptop className="h-6 w-6 text-accent" />
                                <h3 className="text-xl font-bold">AI智能体 | AI Agent</h3>
                              </div>
                              <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                  <span>基于IDE | IDE-based</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                  <span>AI嵌入工作环境 | AI embedded in context</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                  <span>可读写文件、搜索网络、运行脚本 | Can read/edit files, search web, run scripts</span>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <Alert className="border-l-4 border-accent">
                            <Lightbulb className="h-5 w-5 text-accent" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold text-lg mb-2">核心洞察 | Key Insight</p>
                              <p className="text-foreground">
                                大语言模型不仅能产生文本，<strong>它们现在可以对文件和文件夹执行操作</strong>。
                              </p>
                              <p className="text-foreground mt-1">
                                LLMs don't just produce text - <strong>they can now take actions on files and folders</strong>.
                              </p>
                            </AlertDescription>
                          </Alert>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Module 2: IDE Interface */}
                  <Collapsible open={moduleStates.module2} onOpenChange={(open) => setModuleStates({...moduleStates, module2: open})}>
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Laptop className="h-6 w-6" />
                            模块2: 熟悉IDE界面 | Module 2: IDE Interface
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          <h4 className="text-lg font-semibold">典型IDE的四个主要区域 | Four Main Areas of a Typical IDE</h4>
                          <div className="rounded-lg overflow-hidden border-2 border-muted">
                            <img src={traeIdeInterface} alt="Trae IDE interface" className="w-full" />
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <p className="font-semibold">左侧面板</p>
                              <p className="text-muted-foreground">文件导航器 | File Navigator</p>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                              <p className="font-semibold">中间面板</p>
                              <p className="text-muted-foreground">编辑器 | Editor</p>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-lg">
                              <p className="font-semibold">右侧面板</p>
                              <p className="text-muted-foreground">AI对话 | AI Chat (Builder)</p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="font-semibold">底部区域</p>
                              <p className="text-muted-foreground">终端 | Terminal</p>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Module 3: Input-Process-Output */}
                  <Collapsible open={moduleStates.module3} onOpenChange={(open) => setModuleStates({...moduleStates, module3: open})}>
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Zap className="h-6 w-6" />
                            模块3: 输入-处理-输出模型 | Module 3: Input-Process-Output Model
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          <p className="text-foreground">
                            每个AI智能体任务都遵循简单的三步模型 | Every AI Agent task follows a simple three-step model:
                          </p>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                              <h5 className="font-bold text-purple-600 mb-2">📥 输入 Input</h5>
                              <p className="text-sm">文件/文件夹路径 | File/Folder paths</p>
                              <p className="text-xs text-muted-foreground mt-1">右键点击复制路径 | Right-click to copy</p>
                            </div>
                            <div className="p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                              <h5 className="font-bold text-blue-600 mb-2">⚙️ 处理 Process</h5>
                              <p className="text-sm">自然语言指令 | Natural language instructions</p>
                              <p className="text-xs text-muted-foreground mt-1">描述你想做什么 | Describe what you want</p>
                            </div>
                            <div className="p-4 rounded-lg border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                              <h5 className="font-bold text-green-600 mb-2">📤 输出 Output</h5>
                              <p className="text-sm">目标文件夹 | Destination folder</p>
                              <p className="text-xs text-muted-foreground mt-1">结果保存位置 | Where results are saved</p>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Module 4: APIs and API Keys */}
                  <Collapsible open={moduleStates.module4} onOpenChange={(open) => setModuleStates({...moduleStates, module4: open})}>
                    <Card className="border-2 border-primary">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between hover:from-primary/90 hover:to-primary/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Key className="h-6 w-6" />
                            模块4: 理解API | Module 4: Understanding APIs
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          <div className="bg-muted/50 p-6 rounded-lg">
                            <h4 className="font-semibold mb-3">什么是API? | What is an API?</h4>
                            <p className="text-foreground mb-4">
                              API（应用程序编程接口）是软件系统之间通信的标准化方式。
                            </p>
                            <p className="text-foreground">
                              API (Application Programming Interface) is a standardized way for software systems to communicate.
                            </p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-background rounded-lg border">
                              <h5 className="font-semibold mb-2">🪙 Token (令牌)</h5>
                              <ul className="text-sm space-y-1">
                                <li>• 1 token ≈ 4个字符 / 0.75个英文单词</li>
                                <li>• 更多token = 更多计算 = 更高成本</li>
                              </ul>
                            </div>
                            <div className="p-4 bg-background rounded-lg border">
                              <h5 className="font-semibold mb-2">💰 成本估算 | Cost Estimate</h5>
                              <ul className="text-sm space-y-1">
                                <li>• Kimi: ¥15 免费额度</li>
                                <li>• 工作坊总预算: ¥20-50足够</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Lab 2: Batch Processing */}
                  <Collapsible open={moduleStates.lab2} onOpenChange={(open) => setModuleStates({...moduleStates, lab2: open})}>
                    <Card className="border-2 border-accent">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground p-4 flex items-center justify-between hover:from-accent/90 hover:to-accent/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <FileText className="h-6 w-6" />
                            实验2: 批量处理 | Lab 2: Batch Processing
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          <Alert className="border-l-4 border-accent">
                            <Microscope className="h-5 w-5 text-accent" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold">研究应用 | Research Application</p>
                              <p className="text-sm">使用API批量分析BAWE语料库中的文本 | Batch analyze texts from BAWE corpus using API</p>
                            </AlertDescription>
                          </Alert>

                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">任务概述 | Task Overview</h4>
                            <ul className="space-y-2 text-sm">
                              <li><strong>输入 Input:</strong> Data/BAWE/CORPUS_ByDiscipline (5个文本文件)</li>
                              <li><strong>处理 Process:</strong> 使用提示词文件逐个分析每个文件</li>
                              <li><strong>输出 Output:</strong> Lab2_Results/analysis_results.csv</li>
                            </ul>
                          </div>

                          <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                            <h4 className="font-semibold mb-2">核心价值 | Core Value</h4>
                            <p className="text-sm text-foreground">
                              使用API自动化重复任务，消除手动复制粘贴 | Automate repetitive tasks with APIs, eliminating manual copy-paste
                            </p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  {/* Lab 3: Literature Screening */}
                  <Collapsible open={moduleStates.lab3} onOpenChange={(open) => setModuleStates({...moduleStates, lab3: open})}>
                    <Card className="border-2 border-accent">
                      <CollapsibleTrigger asChild>
                        <button className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground p-4 flex items-center justify-between hover:from-accent/90 hover:to-accent/70 transition-all">
                          <h3 className="font-semibold text-left flex items-center gap-2 text-xl">
                            <Microscope className="h-6 w-6" />
                            实验3: 文献筛选 | Lab 3: Literature Screening
                          </h3>
                          <ChevronDown className="h-5 w-5 flex-shrink-0" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-5 bg-card">
                        <div className="space-y-6">
                          <Alert className="border-l-4 border-accent">
                            <Microscope className="h-5 w-5 text-accent" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold">文献综述自动化 | Automating Literature Review</p>
                              <p className="text-sm">批量筛选和分类学术文献 | Batch screen and categorize academic literature</p>
                            </AlertDescription>
                          </Alert>

                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3">任务概述 | Task Overview</h4>
                            <ul className="space-y-2 text-sm">
                              <li><strong>输入 Input:</strong> CSV文件 (~200篇BAWE/DDL相关研究)</li>
                              <li><strong>处理 Process:</strong> 筛选前10篇，按研究背景、目标、数据、发现、启示分类</li>
                              <li><strong>输出 Output:</strong> Lab3_Results/screening_results.csv</li>
                            </ul>
                          </div>

                          <div className="p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                            <h4 className="font-semibold mb-2">研究应用 | Research Applications</h4>
                            <ul className="text-sm space-y-1">
                              <li>• 系统性文献综述 | Systematic literature reviews</li>
                              <li>• 快速筛选相关研究 | Rapid screening of relevant studies</li>
                              <li>• 提取关键信息 | Extracting key information</li>
                            </ul>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </TabsContent>

                {/* REFLECTION TAB */}
                <TabsContent value="reflection" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>讨论你的用例 | Discuss Your Use Case</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        与AI助手讨论如何在你的研究中应用批量处理技术 | Discuss with the AI assistant how to apply batch processing in your research
                      </p>
                      <WorkshopUseCaseChat onConversationShared={() => setBbsRefresh(prev => prev + 1)} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>共享讨论区 | Shared Discussions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WorkshopUseCaseBBS refreshTrigger={bbsRefresh} />
                    </CardContent>
                  </Card>

                </TabsContent>
              </Tabs>

              {/* Speaker Info */}
              <Card>
                <CardHeader>
                  <CardTitle>主讲人 | Speaker</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">王浩博士 | Dr. Simon Wang</h3>
                  <p className="text-muted-foreground">
                    香港浸会大学语言中心讲师及创新主任 | Lecturer and Innovation Officer, Language Centre, HKBU
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WorkshopBNBU;
