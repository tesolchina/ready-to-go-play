import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Globe, ChevronDown, ExternalLink, QrCode, BookOpen, GraduationCap, FileText, Microscope } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";

const WorkshopAIAgentArchive11Dec = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const WORKSHOP_PAGE_URL = "https://eapteacher.smartutor.me/workshops/ai-agent-workshop-11dec";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold lg:hidden">Workshop 工作坊</h2>
          </header>
          <div className="p-8">
            <div className="max-w-4xl mx-auto space-y-8">
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
                  <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-lg font-semibold">
                    研究生专场 | Graduate Students
                  </span>
                </div>
              </div>

              {/* Event Info Card */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">日期 Date</p>
                        <p className="text-muted-foreground">2025年12月11日 (周四)</p>
                        <p className="text-muted-foreground">December 11, 2025 (Thursday)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">时间 Time</p>
                        <p className="text-muted-foreground">下午 Afternoon</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">地点 Location</p>
                        <p className="text-muted-foreground">北京师范大学-香港浸会大学联合国际学院</p>
                        <p className="text-muted-foreground">Beijing Normal University-Hong Kong Baptist University United International College, Zhuhai</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">对象 Audience</p>
                        <p className="text-muted-foreground">博士生、授课型硕士生</p>
                        <p className="text-muted-foreground">PhD Students & Taught Master Students</p>
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

              {/* QR Code Section */}
              {qrCodeVisible && (
                <Card>
                  <CardHeader>
                    <CardTitle>分享本工作坊 | Share this Workshop</CardTitle>
                    <CardDescription>扫描二维码访问本页面</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="p-6 bg-white rounded-lg">
                      <QRCode 
                        value={WORKSHOP_PAGE_URL}
                        size={256}
                        level="H"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      {WORKSHOP_PAGE_URL}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Event Details Collapsible */}
              <Card>
                <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full flex items-center justify-between p-6 h-auto hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5" />
                        <span className="text-lg font-semibold">活动详情 | Event Details</span>
                      </div>
                      <ChevronDown className={`h-5 w-5 transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6 pt-0">
                      <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <p className="text-lg font-semibold mb-2">面向对象 | Target Audience</p>
                        <p className="text-muted-foreground">北师港浸大博士研究生及授课型硕士研究生</p>
                        <p className="text-muted-foreground">PhD students and taught master students at BNBU Zhuhai</p>
                      </div>

                      <div className="grid gap-4">
                        <div className="flex items-start gap-3">
                          <Globe className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                          <div>
                            <p className="font-medium">语言 | Language</p>
                            <p className="text-muted-foreground">双语 (中文/英文) | Bilingual (Chinese/English)</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Abstract - Bilingual */}
              <Card>
                <CardHeader>
                  <CardTitle>摘要 | Abstract</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    本工作坊将介绍在集成开发环境（IDE）中嵌入的AI智能体作为学术研究的强大工具。与需要频繁切换上下文的传统聊天机器人不同，IDE中的AI智能体可以直接访问、读取和编辑项目文件，执行网络搜索，并生成代码以自动化研究任务。
                  </p>
                  <p className="text-foreground leading-relaxed">
                    This workshop introduces IDE-embedded AI agents as a powerful alternative to browser-based AI interactions for academic research. Unlike traditional chatbots that require constant context-switching, AI agents within Integrated Development Environments can directly access, read, and edit project files, perform web searches, and generate code to automate research tasks.
                  </p>
                </CardContent>
              </Card>

              {/* Workshop Focus - Research Emphasis */}
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
                          学习如何使用AI智能体辅助学术论文写作、文献综述和研究报告
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Learn to use AI agents for academic paper writing, literature reviews, and research reports
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">•</span>
                      <div>
                        <strong>批量处理研究文献 | Batch Processing Research Literature</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          掌握使用API技术批量分析和筛选学术文献的方法
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Master batch analysis and screening of academic literature using API technology
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">•</span>
                      <div>
                        <strong>自动化研究工作流程 | Automating Research Workflows</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          消除重复性工作，将AI智能体整合到现有研究流程中
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Eliminate repetitive tasks and integrate AI agents into existing research processes
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-accent font-bold">•</span>
                      <div>
                        <strong>输入-处理-输出模型 | Input-Process-Output Model</strong>
                        <p className="text-muted-foreground text-sm mt-1">
                          理解并应用这一核心框架来设计AI辅助的研究任务
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Understand and apply this core framework for designing AI-assisted research tasks
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Key Takeaways - Bilingual */}
              <Card>
                <CardHeader>
                  <CardTitle>主要收获 | Key Takeaways</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <div>
                        <strong>消除上下文切换 | Eliminate Context-Switching</strong>
                        <p className="text-sm text-muted-foreground">AI智能体直接在项目环境中工作</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <div>
                        <strong>自动化文献综述 | Automate Literature Reviews</strong>
                        <p className="text-sm text-muted-foreground">批量分析和筛选研究文献</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <div>
                        <strong>生成研究工具 | Generate Research Tools</strong>
                        <p className="text-sm text-muted-foreground">无需编程经验即可创建分析脚本</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <div>
                        <strong>提升研究效率 | Enhance Research Efficiency</strong>
                        <p className="text-sm text-muted-foreground">将AI辅助整合到学术工作流程中</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Speaker Info */}
              <Card>
                <CardHeader>
                  <CardTitle>主讲人 | Speaker</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">王晓明博士 | Dr. Simon Wang</h3>
                  <p className="text-muted-foreground mb-3">
                    香港浸会大学语言中心讲师及创新主任
                  </p>
                  <p className="text-muted-foreground mb-3">
                    Lecturer and Innovation Officer at the Language Centre, Hong Kong Baptist University
                  </p>
                  <p className="text-foreground leading-relaxed">
                    王博士专注于将技术融入教育，特别擅长利用生成式AI等创新工具赋能教育工作者和提升学习体验。
                  </p>
                  <p className="text-foreground leading-relaxed mt-2">
                    Dr. Wang specializes in integrating technology into education, harnessing innovative tools like Generative AI to empower educators and enhance learning experiences.
                  </p>
                </CardContent>
              </Card>

              {/* Workshop Materials for Participants */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle>参会者资料 | For Participants</CardTitle>
                  <CardDescription>访问工作坊材料和活动</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    参加本工作坊的学员可访问完整的参会指南，包括准备材料、工作坊活动和后续资源。
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Participants can access the complete guide including preparation materials, workshop activities, and follow-up resources.
                  </p>
                  <Button asChild className="w-full sm:w-auto">
                    <Link to="/workshops/ai-agent-workshop-11dec/delivery">
                      <BookOpen className="h-4 w-4 mr-2" />
                      访问工作坊材料 | Access Workshop Materials
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Previous Workshop Link */}
              <Card className="border-muted">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    往期工作坊 | Previous Workshop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    查看2025年12月3日在香港理工大学举办的工作坊材料。
                  </p>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link to="/workshops/ai-agent-workshop/archive/3dec">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      查看12月3日工作坊 | View Dec 3 Workshop
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WorkshopAIAgentArchive11Dec;
