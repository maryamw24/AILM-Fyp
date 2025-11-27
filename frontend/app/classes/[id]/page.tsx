"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Trophy, MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssignmentsTab } from "@/components/tabs/assignment-tab";
import { ResourcesTab } from "@/components/tabs/resources-tab";
import { LeaderboardTab } from "@/components/tabs/leaderboard-tab";
import { ChatTab } from "@/components/tabs/chat-tab";
import { MembersTab } from "@/components/tabs/members-tab";
import Link from "next/link";
import { classService } from "@/services/classService";
import { Class } from "@/models/class";
import { useAuth } from "@/contexts/auth-context";



export default function ClassDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const classId = params.id as string;

  const [activeTab, setActiveTab] = useState("assignments");
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);

  const isTeacher = user?.role === "teacher";
  const isOwner = classData?.owner_id === user?.id;

  useEffect(() => {
    async function fetchClass() {
      try {
        const data = await classService.getClass(classId);
        setClassData(data);
      } catch (err) {
        console.error("Error loading class:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchClass();
  }, [classId]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg">
        Loading class...
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg text-red-600">
        Failed to load class.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <div className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-300 rounded-b-2xl shadow-lg px-4 sm:px-6 lg:px-8 py-4 md:py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {classData.title}
          </h1>
          <p className="text-white/90 text-xs sm:text-sm flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/60"></span>
            Class Code: {classData.code}
          </p>
        </div>
      </div>

      <div className="bg-background border-b border-border px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${isTeacher ? "grid-cols-2 sm:grid-cols-5" : "grid-cols-2 sm:grid-cols-4"} gap-2 sm:gap-0`}>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              {isTeacher && <TabsTrigger value="members">Members</TabsTrigger>}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="max-w-6xl mx-auto">

            {activeTab === "assignments" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Assignments</h2>
                  {isTeacher && isOwner && (
                    <Link href={`/classes/${classId}/add-assignment`}>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create Assignment
                      </Button>
                    </Link>
                  )}
                </div>
                <AssignmentsTab />
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Resources</h2>
                  {isTeacher && isOwner && (
                    <Link href={`/classes/${classId}/add-resource`}>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Resource
                      </Button>
                    </Link>
                  )}
                </div>
                <ResourcesTab />
              </div>
            )}

            {activeTab === "leaderboard" && <LeaderboardTab />}
            {activeTab === "chat" && <ChatTab />}
            {activeTab === "members" && isTeacher && <MembersTab />}

          </div>
        </div>
      </div>
    </div>
  );
}
