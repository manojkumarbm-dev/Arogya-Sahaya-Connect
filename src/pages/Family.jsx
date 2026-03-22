import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { FamilyMember } from "@/entities/FamilyMember";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Edit, Trash2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function FamilyPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      // NOTE: Using a placeholder ID for now to fetch sample data.
      // In a real scenario, this would be user.id
      const fetchedMembers = await FamilyMember.filter({ primary_user_id: "user-abc-123" });
      setFamilyMembers(fetchedMembers);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };
  
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-900 mb-2">Family Members</h1>
            <p className="text-purple-700">Manage your family's health profiles.</p>
          </div>
          <Button className="bg-primary-purple hover:bg-primary-light-purple">
            <Plus className="w-4 h-4 mr-2" /> Add Member
          </Button>
        </div>

        {isLoading ? (
          <p>Loading family members...</p>
        ) : familyMembers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyMembers.map(member => (
              <Card key={member.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-pink-100 text-pink-600 font-bold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-purple-900">{member.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 capitalize">{member.relationship}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm"><span className="font-semibold">ABHA ID:</span> {member.abha_id}</p>
                  <p className="text-sm"><span className="font-semibold">Born:</span> {new Date(member.date_of_birth).toLocaleDateString()}</p>
                  <p className="text-sm"><span className="font-semibold">Blood Group:</span> <Badge variant="destructive">{member.blood_group}</Badge></p>
                  {member.medical_conditions && member.medical_conditions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Conditions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.medical_conditions.map(cond => <Badge key={cond} variant="outline">{cond}</Badge>)}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Shield className="w-4 h-4 mr-2" /> Records
                    </Button>
                    <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">No Family Members Added</h3>
            <p className="text-gray-500 mt-2">Click "Add Member" to create profiles for your family.</p>
          </div>
        )}
      </div>
    </div>
  );
}