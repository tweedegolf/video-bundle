<?php

namespace TweedeGolf\VideoBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\JsonResponse;
use TweedeGolf\VideoBundle\Entity\Video;

/**
 * Class DefaultController.
 *
 * @Route("/admin/video")
 */
class DefaultController extends Controller
{
    /**
     * @return JsonResponse
     *
     * @Route("/list")
     */
    public function listAction()
    {
        $videos = $this->getDoctrine()->getRepository('TGVideoBundle:Video')->findAll([], ['createdAt' => 'DESC']);

        $serializer = new Serializer([$this->get('tg_video.normalizer')]);

        return new JsonResponse([
            'videos' => $serializer->normalize($videos)
        ]);
    }

    /**
     * @return JsonResponse
     *
     * @Route("/sync")
     */
    public function syncAction()
    {
        // get all video's from the channel with id given by the parameter 'youtube_channel_id'
        $apiKey = $this->getParameter('youtube_api_key');
        $channelId = $this->getParameter('youtube_channel_id');

        try {
            $videos = $this->getPublicVideosByChannelId($apiKey, $channelId);
        } catch (\Exception $e) {
            $this->get('logger')->error('Exception occurred trying to connect to Youtube api');

            return new JsonResponse([
                'videos' => []
            ]);
        }

        // save videos locally if they don't exist yet
        $em = $this->getDoctrine()->getManager();

        foreach ($videos as $video) {
            $name = $video->snippet->title;
            $youtubeId = $video->snippet->resourceId->videoId;
            $description = $video->snippet->description;
            $publishedDate = \DateTime::createFromFormat(
                'Y-m-d',
                substr($video->snippet->publishedAt, 0, 10)
            );

            if (property_exists($video->snippet->thumbnails, 'maxres')) {
                $thumbnail = $video->snippet->thumbnails->maxres->url;
            } elseif (property_exists($video->snippet->thumbnails, 'high')) {
                $thumbnail = $video->snippet->thumbnails->high->url;
            } elseif (property_exists($video->snippet->thumbnails, 'medium')) {
                $thumbnail = $video->snippet->thumbnails->medium->url;
            } else {
                $thumbnail = $video->snippet->thumbnails->default->url;
            }

            $video = $em->getRepository('TGVideoBundle:Video')->findOneBy(['youtubeId' => $youtubeId]);
            if ($video === null) {
                $video = new Video();
                $video->setYoutubeId($youtubeId);
                $em->persist($video);
            }

            $video->setName($name);
            $video->setDescription($description);
            $video->setThumbnail($thumbnail);
            $video->setUrl('https://www.youtube.com/embed/' . $youtubeId);
            $video->setCreatedAt($publishedDate);
            $video->setUpdatedAt($publishedDate);
        }

        $em->flush();

        // return videos serialized
        $videos = $this->getDoctrine()->getRepository('TGVideoBundle:Video')->findBy([], ['createdAt' => 'DESC']);
        $serializer = new Serializer([$this->get('tg_video.normalizer')]);

        return new JsonResponse([
            'videos' => $serializer->normalize($videos)
        ]);
    }

    /**
     * Get all videos from the channel with the given channel id
     *
     * @param $apiKey string
     * @param $channelId string
     * @return array
     * @throws \Exception
     */
    private function getPublicVideosByChannelId($apiKey, $channelId)
    {
        $youtube = new \Madcoda\Youtube\Youtube(['key' => $apiKey]);

        // trick to get the id of the list containing all uploads in the channel
        $uploadsPlaylistId = 'UU' . substr($channelId, 2);

        $videos = $youtube->getPlaylistItemsByPlaylistId($uploadsPlaylistId);

        return array_filter($videos, function ($video) {
            return $video->status->privacyStatus === 'public';
        });
    }
}
