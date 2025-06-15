import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Eye, Play, HelpCircle } from "lucide-react";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { EducationalContent } from "@shared/schema";

export default function Education() {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  
  const { data: content, isLoading } = useQuery({
    queryKey: ["/api/educational-content"],
    queryFn: api.getEducationalContent,
  });

  const createContentMutation = useMutation({
    mutationFn: api.createEducationalContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/educational-content"] });
      toast({ title: "Content created successfully!" });
      setShowAddForm(false);
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="text-white" size={12} />;
      case "quiz":
        return <HelpCircle className="text-white" size={12} />;
      default:
        return <Eye className="text-white" size={12} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-yellow-500";
      case "quiz":
        return "bg-purple-500";
      default:
        return "bg-green-500";
    }
  };

  const handleQuizSubmit = () => {
    const correctAnswers = {
      quiz1: "Non-biodegradable waste bin",
      quiz2: "Once a week"
    };
    
    let correct = 0;
    Object.entries(correctAnswers).forEach(([question, answer]) => {
      if (quizAnswers[question] === answer) {
        correct++;
      }
    });
    
    const score = (correct / Object.keys(correctAnswers).length) * 100;
    toast({ 
      title: `Quiz submitted! Your score: ${score}%`,
      description: score >= 80 ? "Great job!" : "Keep learning!"
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Education Portal</h2>
            <p className="text-gray-600">Manage educational content for proper waste segregation</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="text-white"
            style={{ backgroundColor: 'var(--municipal-blue)' }}
          >
            <Plus className="mr-2" size={16} />
            Add Content
          </Button>
        </div>
      </div>

      {/* Educational Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {content?.map((item: EducationalContent) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-4xl">
                {item.type === "video" ? "🎥" : item.type === "quiz" ? "❓" : "📚"}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-white px-2 py-1 rounded-full text-xs font-medium flex items-center ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                  <span className="ml-1">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                </span>
                <span className="text-xs text-gray-500">
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  <Eye className="inline mr-1" size={12} />
                  {item.views} views
                </span>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Quiz Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Interactive Quiz</h3>
          <div className="max-w-2xl">
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Question 1: Which bin should plastic bottles go into?</h4>
              <RadioGroup 
                value={quizAnswers.quiz1 || ""} 
                onValueChange={(value) => setQuizAnswers(prev => ({ ...prev, quiz1: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Biodegradable waste bin" id="q1-a" />
                  <Label htmlFor="q1-a">Biodegradable waste bin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Non-biodegradable waste bin" id="q1-b" />
                  <Label htmlFor="q1-b">Non-biodegradable waste bin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Special waste bin" id="q1-c" />
                  <Label htmlFor="q1-c">Special waste bin</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Question 2: How often should you clean your waste bins?</h4>
              <RadioGroup 
                value={quizAnswers.quiz2 || ""} 
                onValueChange={(value) => setQuizAnswers(prev => ({ ...prev, quiz2: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Once a month" id="q2-a" />
                  <Label htmlFor="q2-a">Once a month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Once a week" id="q2-b" />
                  <Label htmlFor="q2-b">Once a week</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="After every use" id="q2-c" />
                  <Label htmlFor="q2-c">After every use</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              onClick={handleQuizSubmit}
              className="text-white"
              style={{ backgroundColor: 'var(--municipal-blue)' }}
            >
              Submit Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Content Form */}
      {showAddForm && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Educational Content</h3>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                type: formData.get('type') as string,
                content: formData.get('content') as string,
              };
              createContentMutation.mutate(data);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input name="title" placeholder="Content title" required />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea name="description" placeholder="Brief description" required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea name="content" placeholder="Main content body" rows={5} required />
                </div>
                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    className="text-white"
                    style={{ backgroundColor: 'var(--municipal-blue)' }}
                    disabled={createContentMutation.isPending}
                  >
                    {createContentMutation.isPending ? "Creating..." : "Create Content"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
