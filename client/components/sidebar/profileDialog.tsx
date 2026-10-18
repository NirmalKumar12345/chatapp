"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AlignLeft, AtSign, Camera, Mail, Phone, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/authStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  useMyProfile,
  useUploadProfilePicture,
  useUserProfile,
} from "@/hooks/users/useUserProfile";

function ProfileDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-words text-sm font-medium">
          {value?.trim() || "Not added"}
        </p>
      </div>
    </div>
  );
}

export default function ProfileDialog() {
  const { user: authUser, isLoading, hasCheckedAuth } = useAuthStore();
  const { data: profileData, isLoading: isProfileLoading } = useMyProfile();
  const user = profileData?.user ?? authUser;
  const updateProfile = useUserProfile();
  const uploadProfilePicture = useUploadProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const handleDialogOpenChange = (open: boolean) => {
    if (open && user) {
      setName(user.name);
      setUsername(user.username);
      setBio(user.bio ?? "");
      setIsEditing(false);
    }
  };

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfile.mutate(
      {
        name: name.trim(),
        username: username.trim().toLowerCase(),
        bio: bio.trim(),
      },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  if (!user) {
    if (isLoading || !hasCheckedAuth || isProfileLoading) {
      return (
        <div
          className="flex min-w-0 items-center gap-3"
          role="status"
          aria-label="Loading profile"
        >
          <Skeleton className="size-12 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <Dialog onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-w-0 justify-start gap-3 p-0 text-left hover:bg-transparent"
          aria-label="View your profile"
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="flex cursor-pointer size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                  {user.profilePic ? (
                    <Image
                      src={user.profilePic}
                      alt=""
                      width={48}
                      height={48}
                      className="size-full object-cover"
                    />
                  ) : (
                    <User className="size-6 text-muted-foreground" />
                  )}
                </span>
              }
            />
            <TooltipContent>
              <p>View profile</p>
            </TooltipContent>
          </Tooltip>
          <span className="min-w-0">
            <span className="block truncate font-semibold">{user.name}</span>
            <span className="block truncate text-sm text-muted-foreground">
              @{user.username}
            </span>
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] overscroll-contain overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>My profile</DialogTitle>
          <DialogDescription>
            Your account details and contact information.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-muted ring-4 ring-primary/10">
              {user.profilePic ? (
                <Image
                  src={user.profilePic}
                  alt={user.name}
                  width={96}
                  height={96}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-11 text-muted-foreground" />
              )}
            </div>
            {isEditing && (<Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 size-6 cursor-pointer rounded-full border-2 border-background shadow-sm"
                    disabled={uploadProfilePicture.isPending}
                    aria-label={
                      uploadProfilePicture.isPending
                        ? "Uploading profile photo"
                        : "Change profile photo"
                    }
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="size-4" />
                  </Button>
                }
              />
              <TooltipContent side={"right"}>
                {uploadProfilePicture.isPending
                  ? "Uploading photo..."
                  : "Change profile photo"}
              </TooltipContent>
            </Tooltip>)}
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-label="Choose a profile picture"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) uploadProfilePicture.mutate(file);
              event.currentTarget.value = "";
            }}
          />
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <AtSign className="size-3.5" />
            {user.username}
          </p>
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileSubmit} className="grid gap-2">
            <div className="grid gap-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={50}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-username">Username</Label>
              <Input
                id="profile-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                minLength={3}
                maxLength={30}
                pattern="[A-Za-z0-9_]+"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-bio">About</Label>
              <textarea
                id="profile-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                maxLength={160}
                rows={3}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <p className="text-right text-xs text-muted-foreground">
                {bio.length}/160
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className='cursor-pointer'
                disabled={updateProfile.isPending}
                onClick={() => {
                  setName(user.name);
                  setUsername(user.username);
                  setBio(user.bio ?? "");
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className='cursor-pointer' disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid gap-2">
              <ProfileDetail icon={Mail} label="Email" value={user.email} />
              <ProfileDetail icon={Phone} label="Mobile" value={user.mobile} />
              <ProfileDetail
                icon={AlignLeft}
                label="About"
                value={user.bio}
              />
            </div>
            <Button
              type="button"
              className="w-full cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              Edit profile
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
